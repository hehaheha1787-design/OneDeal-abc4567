#[allow(unused_const, unused_field, lint(public_random))]
/// OneDeal - Full On-Chain Casino
/// Games: Dice, Mines, Plinko, Crash, Scissors, Turtle Race, Slot
module onedeal::casino {
    use one::coin::{Self, Coin};
    use one::oct::OCT;
    use one::balance::{Self, Balance};
    use one::event;
    use one::random::{Self, Random};

    // ============ Errors ============
    const EInsufficientBalance: u64 = 0;
    const EInvalidAmount: u64 = 1;
    const EUnauthorized: u64 = 2;
    const EInvalidBet: u64 = 3;
    const EInvalidTarget: u64 = 6;
    const EInvalidMineCount: u64 = 7;
    const EAlreadyRevealed: u64 = 8;
    const EGameOver: u64 = 9;
    const ECrashNotStarted: u64 = 10;
    const ECrashAlreadyCashed: u64 = 11;
    const EInvalidChoice: u64 = 12;
    const EInvalidTurtle: u64 = 13;
    const ERaceNotFinished: u64 = 14;

    // ============ Constants ============
    const HOUSE_EDGE_BPS: u64 = 200; // 2%
    const DICE_MAX: u64 = 10000; // 0.00 - 100.00
    const MIN_BET: u64 = 1_000_000; // 0.001 OCT
    const MAX_MULTIPLIER: u64 = 10000; // 100x

    // Scissors choices
    const ROCK: u64 = 0;
    const PAPER: u64 = 1;
    const SCISSORS: u64 = 2;

    // ============ Structs ============

    public struct AdminCap has key, store {
        id: UID
    }

    public struct House has key {
        id: UID,
        balance: Balance<OCT>,
        total_bets: u64,
        total_wagered: u64,
        total_paid: u64,
    }

    // ============ EVENTS ============

    public struct DiceResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        target: u64,
        is_over: bool,
        result: u64,
        payout: u64,
        won: bool,
    }

    public struct MinesGame has key {
        id: UID,
        player: address,
        bet_amount: u64,
        mine_count: u64,
        board: vector<bool>,
        revealed: vector<bool>,
        revealed_count: u64,
        game_over: bool,
        cashed_out: bool,
        current_multiplier: u64,
    }

    public struct MinesResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        mine_count: u64,
        revealed_count: u64,
        payout: u64,
        hit_mine: bool,
    }

    public struct PlinkoResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        rows: u64,
        risk: u64,
        bucket: u64,
        multiplier: u64,
        payout: u64,
    }

    public struct CrashGame has key {
        id: UID,
        player: address,
        bet_amount: u64,
        crash_point: u64,      // Hidden until crash
        current_multiplier: u64,
        cashed_out: bool,
        crashed: bool,
    }

    public struct CrashResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        crash_point: u64,
        cashout_at: u64,
        payout: u64,
        won: bool,
    }

    public struct ScissorsResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        player_choice: u64,
        house_choice: u64,
        payout: u64,
        result: u64, // 0=lose, 1=draw, 2=win
    }

    public struct TurtleRace has key {
        id: UID,
        player: address,
        bet_amount: u64,
        chosen_turtle: u64,    // 0-3
        winner: u64,
        finished: bool,
    }

    public struct TurtleResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        chosen_turtle: u64,
        winner: u64,
        payout: u64,
        won: bool,
    }

    public struct SlotResultEvent has copy, drop {
        player: address,
        bet_amount: u64,
        // 3x5 grid: row0 (top), row1 (middle), row2 (bottom)
        row0_reel0: u64,
        row0_reel1: u64,
        row0_reel2: u64,
        row0_reel3: u64,
        row0_reel4: u64,
        row1_reel0: u64,
        row1_reel1: u64,
        row1_reel2: u64,
        row1_reel3: u64,
        row1_reel4: u64,
        row2_reel0: u64,
        row2_reel1: u64,
        row2_reel2: u64,
        row2_reel3: u64,
        row2_reel4: u64,
        multiplier: u64,
        payout: u64,
    }

    // ============ Init ============

    fun init(ctx: &mut TxContext) {
        let admin = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin, ctx.sender());

        let house = House {
            id: object::new(ctx),
            balance: balance::zero(),
            total_bets: 0,
            total_wagered: 0,
            total_paid: 0,
        };
        transfer::share_object(house);
    }

    // ============ House Functions ============

    public entry fun fund_house(
        house: &mut House,
        payment: Coin<OCT>,
        _ctx: &mut TxContext
    ) {
        balance::join(&mut house.balance, coin::into_balance(payment));
    }

    // 自动收集 House 拥有的所有 OCT coins 到 balance
    public entry fun collect_house_coins(
        house: &mut House,
        ctx: &mut TxContext
    ) {
        // 获取 House 拥有的所有 OCT coins
        // 注意：这需要手动传入 coin objects
        // 因为 Move 不能自动查询 owned objects
    }

    public entry fun withdraw_house(
        _admin: &AdminCap,
        house: &mut House,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(balance::value(&house.balance) >= amount, EInsufficientBalance);
        let withdrawn = coin::from_balance(balance::split(&mut house.balance, amount), ctx);
        transfer::public_transfer(withdrawn, ctx.sender());
    }

    // ============ 1. DICE ============

    public entry fun play_dice(
        house: &mut House,
        payment: Coin<OCT>,
        target: u64,
        is_over: bool,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);
        assert!(target > 0 && target < DICE_MAX, EInvalidTarget);

        let win_chance = if (is_over) { DICE_MAX - target } else { target };
        let multiplier = ((DICE_MAX - HOUSE_EDGE_BPS) * 100) / win_chance;
        let potential_payout = (bet_amount * multiplier) / 100;
        
        assert!(balance::value(&house.balance) >= potential_payout, EInsufficientBalance);

        let mut generator = random::new_generator(r, ctx);
        let result = random::generate_u64_in_range(&mut generator, 0, DICE_MAX);

        let won = if (is_over) { result > target } else { result < target };

        let payout = if (won) {
            let payout_balance = balance::split(&mut house.balance, potential_payout - bet_amount);
            let mut player_coin = payment;
            balance::join(coin::balance_mut(&mut player_coin), payout_balance);
            transfer::public_transfer(player_coin, ctx.sender());
            potential_payout
        } else {
            balance::join(&mut house.balance, coin::into_balance(payment));
            0
        };

        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;
        house.total_paid = house.total_paid + payout;

        event::emit(DiceResultEvent {
            player: ctx.sender(),
            bet_amount, target, is_over, result, payout, won,
        });
    }

    // ============ 2. MINES ============

    public entry fun start_mines(
        house: &mut House,
        payment: Coin<OCT>,
        mine_count: u64,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);
        assert!(mine_count >= 1 && mine_count <= 24, EInvalidMineCount);

        balance::join(&mut house.balance, coin::into_balance(payment));

        let mut generator = random::new_generator(r, ctx);
        let mut board: vector<bool> = vector[];
        let mut revealed: vector<bool> = vector[];
        
        let mut i = 0;
        while (i < 25) {
            vector::push_back(&mut board, false);
            vector::push_back(&mut revealed, false);
            i = i + 1;
        };

        let mut placed = 0;
        while (placed < mine_count) {
            let pos = random::generate_u64_in_range(&mut generator, 0, 25);
            if (!*vector::borrow(&board, pos)) {
                *vector::borrow_mut(&mut board, pos) = true;
                placed = placed + 1;
            };
        };

        let game = MinesGame {
            id: object::new(ctx),
            player: ctx.sender(),
            bet_amount,
            mine_count,
            board,
            revealed,
            revealed_count: 0,
            game_over: false,
            cashed_out: false,
            current_multiplier: 100,
        };

        transfer::transfer(game, ctx.sender());
        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;
    }

    public entry fun reveal_tile(
        game: &mut MinesGame,
        _house: &mut House,
        position: u64,
        ctx: &mut TxContext
    ) {
        assert!(game.player == ctx.sender(), EUnauthorized);
        assert!(!game.game_over, EGameOver);
        assert!(position < 25, EInvalidBet);
        assert!(!*vector::borrow(&game.revealed, position), EAlreadyRevealed);

        *vector::borrow_mut(&mut game.revealed, position) = true;

        if (*vector::borrow(&game.board, position)) {
            game.game_over = true;
            event::emit(MinesResultEvent {
                player: game.player,
                bet_amount: game.bet_amount,
                mine_count: game.mine_count,
                revealed_count: game.revealed_count,
                payout: 0,
                hit_mine: true,
            });
        } else {
            game.revealed_count = game.revealed_count + 1;
            let safe_tiles = 25 - game.mine_count;
            let remaining_safe = safe_tiles - game.revealed_count + 1;
            let remaining_total = 25 - game.revealed_count + 1;
            game.current_multiplier = (game.current_multiplier * remaining_total * 98) / (remaining_safe * 100);
            
            // Emit event for finding diamond
            event::emit(MinesResultEvent {
                player: game.player,
                bet_amount: game.bet_amount,
                mine_count: game.mine_count,
                revealed_count: game.revealed_count,
                payout: 0,
                hit_mine: false,
            });
        };
    }

    public entry fun cashout_mines(
        game: &mut MinesGame,
        house: &mut House,
        ctx: &mut TxContext
    ) {
        assert!(game.player == ctx.sender(), EUnauthorized);
        assert!(!game.game_over, EGameOver);
        assert!(game.revealed_count > 0, EInvalidBet);

        game.game_over = true;
        game.cashed_out = true;

        let payout = (game.bet_amount * game.current_multiplier) / 100;
        
        if (payout > 0 && balance::value(&house.balance) >= payout) {
            let payout_coin = coin::from_balance(balance::split(&mut house.balance, payout), ctx);
            transfer::public_transfer(payout_coin, game.player);
            house.total_paid = house.total_paid + payout;
        };

        event::emit(MinesResultEvent {
            player: game.player,
            bet_amount: game.bet_amount,
            mine_count: game.mine_count,
            revealed_count: game.revealed_count,
            payout,
            hit_mine: false,
        });
    }

    // ============ 3. PLINKO ============

    public entry fun play_plinko(
        house: &mut House,
        payment: Coin<OCT>,
        rows: u64,
        risk: u64,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);
        assert!(rows == 8 || rows == 12 || rows == 16, EInvalidBet);
        assert!(risk <= 2, EInvalidBet);

        let mut generator = random::new_generator(r, ctx);
        let mut bucket = 0_u64;
        let mut i = 0;
        while (i < rows) {
            if (random::generate_bool(&mut generator)) {
                bucket = bucket + 1;
            };
            i = i + 1;
        };

        let multiplier = get_plinko_multiplier(bucket, rows, risk);
        let payout = (bet_amount * multiplier) / 100;

        if (payout > bet_amount) {
            let profit = payout - bet_amount;
            assert!(balance::value(&house.balance) >= profit, EInsufficientBalance);
            let profit_balance = balance::split(&mut house.balance, profit);
            let mut player_coin = payment;
            balance::join(coin::balance_mut(&mut player_coin), profit_balance);
            transfer::public_transfer(player_coin, ctx.sender());
        } else {
            balance::join(&mut house.balance, coin::into_balance(payment));
            if (payout > 0) {
                let return_coin = coin::from_balance(balance::split(&mut house.balance, payout), ctx);
                transfer::public_transfer(return_coin, ctx.sender());
            };
        };

        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;
        house.total_paid = house.total_paid + payout;

        event::emit(PlinkoResultEvent {
            player: ctx.sender(),
            bet_amount, rows, risk, bucket, multiplier, payout,
        });
    }

    fun get_plinko_multiplier(bucket: u64, rows: u64, risk: u64): u64 {
        let center = rows / 2;
        let distance = if (bucket > center) { bucket - center } else { center - bucket };
        
        let base = if (risk == 0) {
            50 + (distance * 100)
        } else if (risk == 1) {
            30 + (distance * 200)
        } else {
            if (distance == center) { 10000 } else { distance * 300 }
        };

        if (base > MAX_MULTIPLIER) { MAX_MULTIPLIER } else { base }
    }

    // ============ 4. CRASH ============

    public entry fun play_crash(
        house: &mut House,
        payment: Coin<OCT>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);

        balance::join(&mut house.balance, coin::into_balance(payment));

        // Generate crash point (1.00x - 100x)
        let mut generator = random::new_generator(r, ctx);
        let rand = random::generate_u64_in_range(&mut generator, 1, 10000);
        
        // Crash formula: higher numbers = lower crash point
        let crash_point = if (rand < 100) {
            10000 // 100x (rare)
        } else {
            (100 * 10000) / rand // Inverse relationship
        };

        let game = CrashGame {
            id: object::new(ctx),
            player: ctx.sender(),
            bet_amount,
            crash_point,
            current_multiplier: 100,
            cashed_out: false,
            crashed: false,
        };

        transfer::transfer(game, ctx.sender());
        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;
    }

    public entry fun cashout_crash(
        game: &mut CrashGame,
        house: &mut House,
        cashout_multiplier: u64,
        ctx: &mut TxContext
    ) {
        assert!(game.player == ctx.sender(), EUnauthorized);
        assert!(!game.cashed_out, ECrashAlreadyCashed);
        assert!(!game.crashed, EGameOver);

        let won = cashout_multiplier <= game.crash_point;
        
        game.cashed_out = true;
        game.crashed = !won;
        game.current_multiplier = cashout_multiplier;

        let payout = if (won) {
            let amount = (game.bet_amount * cashout_multiplier) / 100;
            if (balance::value(&house.balance) >= amount) {
                let payout_coin = coin::from_balance(balance::split(&mut house.balance, amount), ctx);
                transfer::public_transfer(payout_coin, game.player);
                house.total_paid = house.total_paid + amount;
            };
            amount
        } else {
            0
        };

        event::emit(CrashResultEvent {
            player: game.player,
            bet_amount: game.bet_amount,
            crash_point: game.crash_point,
            cashout_at: cashout_multiplier,
            payout,
            won,
        });
    }

    // ============ 5. SCISSORS (Rock Paper Scissors) ============

    public entry fun play_scissors(
        house: &mut House,
        payment: Coin<OCT>,
        player_choice: u64, // 0=rock, 1=paper, 2=scissors
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);
        assert!(player_choice <= 2, EInvalidChoice);

        let potential_payout = (bet_amount * 196) / 100; // 1.96x on win
        assert!(balance::value(&house.balance) >= potential_payout, EInsufficientBalance);

        let mut generator = random::new_generator(r, ctx);
        let house_choice = random::generate_u64_in_range(&mut generator, 0, 3);

        // 0=lose, 1=draw, 2=win
        let result = if (player_choice == house_choice) {
            1 // Draw
        } else if (
            (player_choice == ROCK && house_choice == SCISSORS) ||
            (player_choice == PAPER && house_choice == ROCK) ||
            (player_choice == SCISSORS && house_choice == PAPER)
        ) {
            2 // Win
        } else {
            0 // Lose
        };

        let payout = if (result == 2) {
            // Win - pay 1.96x
            let payout_balance = balance::split(&mut house.balance, potential_payout - bet_amount);
            let mut player_coin = payment;
            balance::join(coin::balance_mut(&mut player_coin), payout_balance);
            transfer::public_transfer(player_coin, ctx.sender());
            potential_payout
        } else if (result == 1) {
            // Draw - return bet
            transfer::public_transfer(payment, ctx.sender());
            bet_amount
        } else {
            // Lose - house takes bet
            balance::join(&mut house.balance, coin::into_balance(payment));
            0
        };

        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;
        if (result == 2) {
            house.total_paid = house.total_paid + payout;
        };

        event::emit(ScissorsResultEvent {
            player: ctx.sender(),
            bet_amount,
            player_choice,
            house_choice,
            payout,
            result,
        });
    }

    // ============ 6. TURTLE RACE ============

    public entry fun play_turtle(
        house: &mut House,
        payment: Coin<OCT>,
        chosen_turtle: u64, // 0-2 (3 turtles)
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);
        assert!(chosen_turtle <= 2, EInvalidTurtle); // Changed from 3 to 2

        let potential_payout = (bet_amount * 280) / 100; // 2.8x on win (3 turtles, was 3.8x for 4)
        assert!(balance::value(&house.balance) >= potential_payout, EInsufficientBalance);

        balance::join(&mut house.balance, coin::into_balance(payment));

        let mut generator = random::new_generator(r, ctx);
        let winner = random::generate_u64_in_range(&mut generator, 0, 3); // Changed from 4 to 3

        let won = chosen_turtle == winner;
        let payout = if (won) {
            if (balance::value(&house.balance) >= potential_payout) {
                let payout_coin = coin::from_balance(balance::split(&mut house.balance, potential_payout), ctx);
                transfer::public_transfer(payout_coin, ctx.sender());
                house.total_paid = house.total_paid + potential_payout;
            };
            potential_payout
        } else {
            0
        };

        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;

        event::emit(TurtleResultEvent {
            player: ctx.sender(),
            bet_amount,
            chosen_turtle,
            winner,
            payout,
            won,
        });
    }

    // ============ 7. SLOT ============

    public entry fun play_slot(
        house: &mut House,
        payment: Coin<OCT>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInvalidAmount);

        let max_payout = bet_amount * 100; // Max 100x
        assert!(balance::value(&house.balance) >= max_payout, EInsufficientBalance);

        balance::join(&mut house.balance, coin::into_balance(payment));

        let mut generator = random::new_generator(r, ctx);
        
        // 6 symbols (0-5): cherry, lemon, orange, plum, bell, seven
        // Generate 3x5 grid (3 rows, 5 reels)
        // Row 0 (top)
        let row0_reel0 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row0_reel1 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row0_reel2 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row0_reel3 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row0_reel4 = random::generate_u64_in_range(&mut generator, 0, 6);
        
        // Row 1 (middle - main payline)
        let row1_reel0 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row1_reel1 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row1_reel2 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row1_reel3 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row1_reel4 = random::generate_u64_in_range(&mut generator, 0, 6);
        
        // Row 2 (bottom)
        let row2_reel0 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row2_reel1 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row2_reel2 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row2_reel3 = random::generate_u64_in_range(&mut generator, 0, 6);
        let row2_reel4 = random::generate_u64_in_range(&mut generator, 0, 6);

        // Check all 3 horizontal lines for winning combinations
        // Line 0 (top row)
        let mult0 = calculate_line_multiplier(row0_reel0, row0_reel1, row0_reel2, row0_reel3, row0_reel4);
        // Line 1 (middle row)
        let mult1 = calculate_line_multiplier(row1_reel0, row1_reel1, row1_reel2, row1_reel3, row1_reel4);
        // Line 2 (bottom row)
        let mult2 = calculate_line_multiplier(row2_reel0, row2_reel1, row2_reel2, row2_reel3, row2_reel4);
        
        // Take the best multiplier from all lines
        let mut multiplier = mult0;
        if (mult1 > multiplier) multiplier = mult1;
        if (mult2 > multiplier) multiplier = mult2;

        let payout = (bet_amount * multiplier) / 100;

        if (payout > 0 && balance::value(&house.balance) >= payout) {
            let payout_coin = coin::from_balance(balance::split(&mut house.balance, payout), ctx);
            transfer::public_transfer(payout_coin, ctx.sender());
            house.total_paid = house.total_paid + payout;
        };

        house.total_bets = house.total_bets + 1;
        house.total_wagered = house.total_wagered + bet_amount;

        event::emit(SlotResultEvent {
            player: ctx.sender(),
            bet_amount,
            row0_reel0, row0_reel1, row0_reel2, row0_reel3, row0_reel4,
            row1_reel0, row1_reel1, row1_reel2, row1_reel3, row1_reel4,
            row2_reel0, row2_reel1, row2_reel2, row2_reel3, row2_reel4,
            multiplier,
            payout,
        });
    }

    // Helper function to calculate multiplier for a single line
    fun calculate_line_multiplier(r0: u64, r1: u64, r2: u64, r3: u64, r4: u64): u64 {
        // Check left-to-right consecutive matches
        if (r0 == r1 && r1 == r2 && r2 == r3 && r3 == r4) {
            // Five of a kind
            if (r0 == 5) { 20000 }      // 77777 = 200x
            else if (r0 == 4) { 5000 }  // Bells = 50x
            else if (r0 == 3) { 2000 }  // Plums = 20x
            else if (r0 == 2) { 1000 }  // Oranges = 10x
            else if (r0 == 1) { 500 }   // Lemons = 5x
            else { 300 }                 // Cherries = 3x
        } else if (r0 == r1 && r1 == r2 && r2 == r3) {
            // Four of a kind
            if (r0 == 5) { 5000 }       // 7777 = 50x
            else if (r0 == 4) { 1000 }  // Bells = 10x
            else if (r0 == 3) { 500 }   // Plums = 5x
            else if (r0 == 2) { 300 }   // Oranges = 3x
            else if (r0 == 1) { 200 }   // Lemons = 2x
            else { 150 }                 // Cherries = 1.5x
        } else if (r0 == r1 && r1 == r2) {
            // Three of a kind
            if (r0 == 5) { 1000 }       // 777 = 10x
            else if (r0 == 4) { 300 }   // Bells = 3x
            else if (r0 == 3) { 200 }   // Plums = 2x
            else if (r0 == 2) { 150 }   // Oranges = 1.5x
            else if (r0 == 1) { 120 }   // Lemons = 1.2x
            else { 100 }                 // Cherries = 1x (return bet)
        } else if (r0 == r1) {
            // Two of a kind
            if (r0 == 5) { 200 }        // 77 = 2x
            else if (r0 == 4) { 150 }   // Bells = 1.5x
            else if (r0 == 3) { 100 }   // Plums = 1x
            else { 50 }                  // Others = 0.5x
        } else {
            0 // No match
        }
    }

    // ============ View Functions ============

    public fun house_balance(house: &House): u64 {
        balance::value(&house.balance)
    }

    public fun house_stats(house: &House): (u64, u64, u64) {
        (house.total_bets, house.total_wagered, house.total_paid)
    }

    public fun mines_game_state(game: &MinesGame): (u64, u64, u64, bool) {
        (game.bet_amount, game.revealed_count, game.current_multiplier, game.game_over)
    }

    public fun crash_game_state(game: &CrashGame): (u64, u64, bool, bool) {
        (game.bet_amount, game.current_multiplier, game.cashed_out, game.crashed)
    }
}
