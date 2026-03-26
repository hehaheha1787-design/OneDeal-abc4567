const preState = {
    currencies: [
        {
            name: 'OCT',
            fullName: 'OneChain Token',
            decimal: 9,
            token: 'native',
            withdrawable: true,
            swapable: false
        }
    ]
};

const currencyReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_CURRENCIES':
            return {
                ...state,
                currencies: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default currencyReducer;