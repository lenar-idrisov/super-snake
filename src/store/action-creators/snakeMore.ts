import {
    IncreaseSpeedAction,
    updateBarriersAction,
    ListSnakeMoreActions,
    UpdateSnakeAction,
    SnakeMoreState,
    UpdateFoodAction,
    UpdateShiftXYAction
} from "../types/snakeMore";

export default {
    updateBarriers: (payload: SnakeMoreState['barriers']): updateBarriersAction => ({
        type: ListSnakeMoreActions.UPDATE_BARRIERS,
        payload,
    }),

    updateSnake: (payload: SnakeMoreState['snake']): UpdateSnakeAction => ({
        type: ListSnakeMoreActions.UPDATE_SNAKE,
        payload,
    }),

    updateFood: (payload: SnakeMoreState['foodList']): UpdateFoodAction => ({
        type: ListSnakeMoreActions.UPDATE_FOOD,
        payload,
    }),

    updateShiftXY: (payload: SnakeMoreState['shiftXY']): UpdateShiftXYAction => ({
        type: ListSnakeMoreActions.UPDATE_SHIFT_XY,
        payload,
    }),

    increaseSpeed: ():
        IncreaseSpeedAction => ({
        type: ListSnakeMoreActions.INCREASE_SPEED
    })
}