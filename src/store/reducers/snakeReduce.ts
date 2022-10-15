import {Action, SnakeLiveState} from "../../types/customTypes";
import {showError} from "../../service/utils";

const initialState: SnakeLiveState = {
    snake: [],
    foodList: [],
    barriers: []
}

export const snakeReducer = (state=initialState, action: Action): SnakeLiveState => {
    switch (action.type) {
        case 'SET_BARRIERS':
            return {...state, barriers: action.payload};
        case 'MOVE_SNAKE':
            return {...state, snake: action.payload};
        case 'CHANGE_FOOD':
            return {...state, foodList: action.payload};
        default:
            showError('неопознанный action ' + action.type);
            return state;
    }
}