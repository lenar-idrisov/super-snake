import YandexManager from "../service/adv/YandexManager";
import EmptyManager from "../service/adv/EmptyManager";

type FuncWithParam = (value: any) => any;
type FuncEmptyVoid = () => any;

export type GameStatusList = 'init' | 'move' | 'pause' | 'fail' |
    'win' | 'settings' | 'restart';
export type AdvManager = YandexManager | EmptyManager;


// скорость змейки по оси X и Y
export interface SpeedXY {
    dx: number;
    dy: number
}

export interface Speed {
    speedNum: number,
    real: number|null
}

export interface ScoreInfo {
    score: number;
    maxScore: number
}

export interface GameFlags {
    // режим игры с барьерами(true) и без(false)
    isHardMode: boolean;
    isAdvWatched: boolean;
    isDarkMode: boolean;
    isSoundDisable: boolean;
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
    gameStatus: string;
    speedNum: number;
    isSoundDisable: boolean;
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
    changeDirection: FuncWithParam;
}

export interface EndingProps {
    advManager: AdvManager;
    accentColor: string;
    gameStatus: string;
    restart: FuncEmptyVoid;
}

export interface BoardProps extends ScoreInfo, GameFlags {
    advManager: AdvManager;
    isHardMode: boolean;
    isDarkMode: boolean;
    gameStatus: string;
    realSpeed: number;
    speedXY: SpeedXY | null;
    changeDirection: FuncWithParam;
    playSound: FuncWithParam;
    increaseScore: FuncEmptyVoid;
    changeStatus: FuncWithParam;
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
export interface SnakeSlice extends Point {
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
    snake: SnakeSlice[],
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

export interface Action {
    type: string;
    payload: any
}

export interface AppState {
    scoreInfo: ScoreInfo;
    gameFlags: GameFlags;
    speed: Speed;
    gameStatus: string;
    accentColor: string;
    backColorIndex: number;
    isSoundDisable: boolean;
    speedXY: SpeedXY | null;
}