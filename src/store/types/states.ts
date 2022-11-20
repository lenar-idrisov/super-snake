import {BarrierUnit, FoodOne, GameStatusList, SnakeSlice} from "../../types/functionTypes";

export interface AppState {
    gameStatus: GameStatusList | '';
    // цвет кнопок управления
    accentColor: string;
    // цвет фона игры
    backColorIndex: number;
    scoreInfo: {
        score: number;
        maxScore: number;
    }
}

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

export interface FlagsState {
    // режим игры с барьерами(true) и без(false)
    isHardMode: boolean;
    // реклама просмотрена или нет
    isAdvWatched: boolean;
    // темный режим доски
    isDarkMode: boolean;
    // звук включен/выключен
    isSoundDisable: boolean;
}