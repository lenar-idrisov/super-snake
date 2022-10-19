import {BaseSizes, SpeedXY} from "./functionTypes";

type FuncWithParam = (value: any) => any;
type FuncEmptyVoid = () => any;

export interface BoardProps {
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

export interface PauseProps {
    accentColor: string;
    switchPause: FuncEmptyVoid;
}

export interface EndingProps {
    accentColor: string;
    gameStatus: string;
    restart: FuncEmptyVoid;
}

export interface SettingsProps {
    accentColor: string;
    backColorIndex: number;
    gameStatus: string;
    setBackColor: Function;
    setAdvWatched: FuncEmptyVoid;
    switchMode: FuncEmptyVoid;
    switchSettings: FuncEmptyVoid;
}

export interface PanelProps {
    gameStatus: string;
    speedNum: number;
    switchSound: FuncEmptyVoid
    increaseSpeed: FuncEmptyVoid;
    switchDarkMode: FuncEmptyVoid;
    switchPause: FuncEmptyVoid;
    switchSettings: FuncEmptyVoid;
}

export interface ControlsProps {
    accentColor: string;
    changeDirection: FuncWithParam;
}