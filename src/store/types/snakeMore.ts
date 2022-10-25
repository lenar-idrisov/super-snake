import {BarrierUnit, FoodOne, SnakeSlice} from "../../types/functionTypes";

export interface SnakeMoreState {
    // режим игры с барьерами(true) и без(false)
    snake: SnakeSlice[];
    // реклама просмотрена или нет
    foodList: FoodOne[];
    // темный режим доски
    barriers: BarrierUnit[];
    // скорость змейки, отображаемая в боковой панели
    speedNum: number;
    // следующий сдвиг змейки по оси X и Y
    // дельта, прибавляемая к координатам змеи при ее хождении,
    shiftXY: {
        dx: number;
        dy: number
    }
}

export enum ListSnakeMoreActions {
    UPDATE_BARRIERS = 'SNAKE_LIVE.UPDATE_BARRIERS',
    UPDATE_SNAKE = 'SNAKE_LIVE.UPDATE_SNAKE',
    UPDATE_FOOD = 'SNAKE_LIVE.UPDATE_FOOD',
    UPDATE_SHIFT_XY = 'SNAKE_LIVE.UPDATE_SHIFT_XY',
    INCREASE_SPEED = 'SNAKE_LIVE.INCREASE_SPEED',
}

export interface updateBarriersAction {
    type: typeof ListSnakeMoreActions.UPDATE_BARRIERS;
    payload: SnakeMoreState['barriers'];
}

export interface UpdateSnakeAction {
    type: typeof ListSnakeMoreActions.UPDATE_SNAKE;
    payload: SnakeMoreState['snake'];
}

export interface UpdateFoodAction {
    type: typeof ListSnakeMoreActions.UPDATE_FOOD;
    payload: FoodOne[];
}

export interface UpdateShiftXYAction {
    type: typeof ListSnakeMoreActions.UPDATE_SHIFT_XY;
    payload: SnakeMoreState['shiftXY'];
}

export interface IncreaseSpeedAction {
    type: typeof ListSnakeMoreActions.INCREASE_SPEED;
}

export type SnakeMoreActions =
    updateBarriersAction |
    UpdateSnakeAction |
    UpdateFoodAction |
    UpdateShiftXYAction |
    IncreaseSpeedAction;