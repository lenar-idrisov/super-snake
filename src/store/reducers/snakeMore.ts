import {showError} from "../../service/utils";
import {ListSnakeMoreActions, SnakeMoreActions, SnakeMoreState} from "../types/snakeMore";

const initialState: SnakeMoreState = {
    snake: [],
    foodList: [],
    barriers: [],
    speedNum: 1,
    shiftXY: {
        dx: 0,
        dy: 0
    },
}

export const snakeMoreReducer = (
    state = initialState,
    action: SnakeMoreActions):
    SnakeMoreState => {
    switch (action.type) {
        case ListSnakeMoreActions.UPDATE_BARRIERS:
            return {...state, barriers: action.payload};
        case ListSnakeMoreActions.UPDATE_SNAKE:
            return {...state, snake: action.payload};
        case ListSnakeMoreActions.UPDATE_FOOD:
            return {...state, foodList: action.payload};
        case ListSnakeMoreActions.UPDATE_SHIFT_XY:
            return {...state, shiftXY: action.payload};
        case ListSnakeMoreActions.INCREASE_SPEED:
            return {...state, speedNum: (state.speedNum <= 3 ? (state.speedNum + 1) : 1)};
        default: {
            return state;
        }
    }
}