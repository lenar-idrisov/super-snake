import YandexManager from "./adv/YandexManager";
import EmptyManager from "./adv/EmptyManager";

type FuncWithStringParam = (value: string) => void;
type FuncEmptyVoid = () => void;
export type AdvManager = YandexManager | EmptyManager;

// скорость змейки по оси X и Y
export interface SpeedDXDY {
    dx: number;
    dy: number
}

export interface ScoreInfo {
    score: number;
    maxScore: number
}

export interface GameFlags {
    [index: string]: any;

    // режим игры с барьерами(true) и без(false)
    isHardMode: boolean;
    isAdvWatched: boolean;
    isDarkMode: boolean;
}

export interface AppProps {
    advManager: AdvManager;
    // только на мобилке показываем кнопки управления змейкой
    isMobile: boolean;
}

export interface SettingsProps extends GameFlags {
    advManager: AdvManager,
    accentColor: string;
    backColorIndex: number;
    gameStatus: string;
    setBackColor: Function;
    setAdvWatched: FuncEmptyVoid;
    switchMode: FuncEmptyVoid;
    switchSettings: FuncEmptyVoid;
}

export interface PanelProps extends ScoreInfo, GameFlags {
    speedNum: number;
    isSoundEnable: boolean;
    switchSound: FuncEmptyVoid
    increaseSpeed: FuncEmptyVoid;
    switchDarkMode: FuncEmptyVoid;
    switchPause: FuncEmptyVoid;
    switchSettings: FuncEmptyVoid;
}

export interface PauseProps {
    accentColor: string;
    switchPause: FuncEmptyVoid;
}

export interface ControlsProps {
    accentColor: string;
    changeDirection: FuncWithStringParam;
}

export interface EndingProps {
    advManager: AdvManager;
    accentColor: string;
    gameStatus: string;
    restart: FuncEmptyVoid;
}

export interface BoardProps extends ScoreInfo, GameFlags {
    advManager: AdvManager;
    gameStatus: string;
    speedDXDY: SpeedDXDY | null;
    dir: string;
    realSpeed: number;
    changeDirection: FuncWithStringParam;
    playSound: FuncWithStringParam;
    increaseScore: FuncEmptyVoid;
    changeStatus: FuncWithStringParam;
    switchFail: FuncEmptyVoid;
    switchWin: FuncEmptyVoid;
}

export interface SnakeLiveProps extends BoardProps {
    baseSizes: BaseSizes;
}

export interface BaseSizes {
    cellSize: number;
    activeHeight: number;
    activeWidth: number;
    cellQuantity: number;
}

export interface Point {
    x: number,
    y: number,
}

// один сегмент змейки
export interface SnakeOne extends Point {
    color: string
}

// один кубик еды
export interface FoodOne extends Point {
    // хранит цвет квадратика
    i: string,
    // хранит цвет границ квадратика
    j: string
}

// один блок барьера(состоит из нескольких кубиков)
export type BarrierUnit = Point[];

export interface SnakeLiveState {
    snake: SnakeOne[],
    foodList: FoodOne[],
    barriers: BarrierUnit[]
}

export interface BoxStyles {
    width: number,
    height: number,
    top: number,
    left: number,
    backgroundColor?: string,
    borderColor?: string,
}