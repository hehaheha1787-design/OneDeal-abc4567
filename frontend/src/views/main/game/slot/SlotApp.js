import * as PIXI from "pixi.js";
import { Resource } from "./data/Resource";
import { SlotLayer } from "./layer/SlotLayer";

export class SlotApp extends PIXI.Application {

    FRAME_RATE      = 30;

    canvas_width    = 0;
    canvas_height   = 0;

    layer_slot      = null;

    frame_speed     = 0;
    frame_count     = 0;
    speed_delta     = 0;

    authData        = null;
    currency        = null;
    betAmount       = 0;
    betLines        = 0;
    autoCount       = 0;

    started         = false;
    
    // On-chain integration
    playSlotCallback = null;

    onResize(width, height) {
        if(this.canvas_width === width && this.canvas_height === height)
            return;

        this.canvas_width = width;
        this.canvas_height = height;

        if(this.layer_slot !== null)
            this.layer_slot.onResize(width, height);

        this.renderer.resize(width, height);
    }

    startGame() {
        this.frame_speed = 60 / this.FRAME_RATE;

        this.layer_slot = new SlotLayer();
        this.stage.addChild(this.layer_slot);

        const keys = [];
        Resource.forEach(resource => {
            PIXI.Assets.add(resource.key, resource.src);
            keys.push(resource.key);
        });

        PIXI.Assets.load(keys, (progress) => {

        })
        .then((textures) => {
            this.started = true;

            if(this.layer_slot !== null)
                this.layer_slot.init(textures);

            this.ticker.add((delta) => {
                if(this.layer_slot !== null)
                    this.layer_slot.updateAnimation();
            });

            this.ticker.add((delta) => {
                if(this.layer_slot !== null)
                    this.layer_slot.updateTweening();
            });
        });
    }

    destroy(bRemoveView, bStageOptions) {
        super.destroy(bRemoveView, bStageOptions);
    }

    async bet() {
        if(this.authData === null || !this.authData.isAuth) {
            this.postMessage({
                type: 'playzelo-Slot-Error',
                data: 'Please connect your wallet first'
            });
            return;
        }

        if(this.autoCount < 0) {
            if(this.layer_slot !== null)
                this.layer_slot.running = false;
            return;
        }

        this.updateLoading(true);
        this.autoCount--;

        try {
            // Call on-chain playSlot function
            if (this.playSlotCallback) {
                const betAmountInSmallestUnit = Math.floor(this.betAmount * 1e9);
                console.log('Calling playSlot with amount:', betAmountInSmallestUnit);
                
                const result = await this.playSlotCallback(betAmountInSmallestUnit);
                
                console.log('Slot transaction result:', result);
                console.log('Result digest:', result.digest);
                console.log('Result effects:', result.effects);
                console.log('Result events:', result.events);
                
                // Parse events from transaction
                const events = result?.events || [];
                console.log('Found events:', events.length);
                
                const slotEvent = events.find(e => {
                    console.log('Event type:', e.type);
                    return e.type?.includes('SlotResultEvent');
                });
                
                console.log('Slot event:', slotEvent);
                
                if (slotEvent && slotEvent.parsedJson) {
                    const eventData = slotEvent.parsedJson;
                    
                    // Parse 3x5 grid data
                    const row0_reel0 = Number(eventData.row0_reel0);
                    const row0_reel1 = Number(eventData.row0_reel1);
                    const row0_reel2 = Number(eventData.row0_reel2);
                    const row0_reel3 = Number(eventData.row0_reel3);
                    const row0_reel4 = Number(eventData.row0_reel4);
                    
                    const row1_reel0 = Number(eventData.row1_reel0);
                    const row1_reel1 = Number(eventData.row1_reel1);
                    const row1_reel2 = Number(eventData.row1_reel2);
                    const row1_reel3 = Number(eventData.row1_reel3);
                    const row1_reel4 = Number(eventData.row1_reel4);
                    
                    const row2_reel0 = Number(eventData.row2_reel0);
                    const row2_reel1 = Number(eventData.row2_reel1);
                    const row2_reel2 = Number(eventData.row2_reel2);
                    const row2_reel3 = Number(eventData.row2_reel3);
                    const row2_reel4 = Number(eventData.row2_reel4);
                    
                    const multiplier = Number(eventData.multiplier);
                    const payout = Number(eventData.payout) / 1e9;
                    
                    console.log('Parsed slot data:', { 
                        row0: [row0_reel0, row0_reel1, row0_reel2, row0_reel3, row0_reel4],
                        row1: [row1_reel0, row1_reel1, row1_reel2, row1_reel3, row1_reel4],
                        row2: [row2_reel0, row2_reel1, row2_reel2, row2_reel3, row2_reel4],
                        multiplier, 
                        payout 
                    });
                    
                    // Show result notification
                    if (payout > 0) {
                        this.postMessage({
                            type: 'playzelo-Slot-Win',
                            data: `You won ${payout.toFixed(4)} OCT! (${(multiplier / 100).toFixed(2)}x)`
                        });
                    } else {
                        this.postMessage({
                            type: 'playzelo-Slot-Lose',
                            data: `No match. Better luck next time!`
                        });
                    }
                    
                    // Format result for game display
                    // The game expects result[row][reel] format (3x5)
                    const roundData = [
                        [row0_reel0, row0_reel1, row0_reel2, row0_reel3, row0_reel4], // top row
                        [row1_reel0, row1_reel1, row1_reel2, row1_reel3, row1_reel4], // middle row (main payline)
                        [row2_reel0, row2_reel1, row2_reel2, row2_reel3, row2_reel4]  // bottom row
                    ];
                    
                    // Format rewards data
                    const rewardData = [];
                    
                    if (payout > 0) {
                        // Create reward entry for middle line (row 1)
                        const pattern = [
                            [0, 1], // reel 0, row 1 (middle)
                            [1, 1], // reel 1, row 1 (middle)
                            [2, 1], // reel 2, row 1 (middle)
                            [3, 1], // reel 3, row 1 (middle)
                            [4, 1]  // reel 4, row 1 (middle)
                        ];
                        rewardData.push([payout, pattern, 0]); // lineIndex 0 for center line
                    }
                    
                    console.log('Formatted data:', { roundData, rewardData });
                    console.log('Calling showResult...');
                    
                    this.showResult(roundData, rewardData);
                    this.updateGameState();
                } else {
                    console.error('SlotResultEvent not found in events');
                    console.error('Available events:', events);
                    this.updateLoading(false);
                }
            } else {
                this.postMessage({
                    type: 'playzelo-Slot-Error',
                    data: 'Wallet not connected'
                });
                this.updateLoading(false);
            }
        } catch (error) {
            console.error('Slot bet error:', error);
            console.error('Error stack:', error.stack);
            this.postMessage({
                type: 'playzelo-Slot-Error',
                data: error.message || 'Transaction failed'
            });
            this.updateLoading(false);
        }
    }

    showResult(roundData, rewardData) {
        if(this.layer_slot !== null)
            this.layer_slot.showResult(roundData, rewardData);
    }

    updateCurrency(currency) {
        this.currency = currency;
    }

    updateBetAmount(betAmount) {
        this.betAmount = betAmount;
    }

    updateBetLines(lines) {
        this.betLines = lines;
    }

    updateAutoCount(autoCount) {
        this.autoCount = autoCount;
    }

    updateAuthData(authData) {
        this.authData = authData;
    }
    
    setPlaySlotCallback(callback) {
        this.playSlotCallback = callback;
    }

    updateGameState() {
        this.postMessage({type: 'playzelo-Slot-UpdateGameState', data: ''});
    }

    updateLoading(flag) {
        this.postMessage({type: 'playzelo-Slot-UpdateLoading', data: flag});
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }
}