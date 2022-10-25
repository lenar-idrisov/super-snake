import {BaseSizes} from "./functionTypes";

type FuncWithParam = (value: any) => any;
type FuncEmptyVoid = () => any;

export interface BoardProps {
    changeDirection: FuncWithParam;
    playSound: FuncWithParam;
    increaseScore: FuncEmptyVoid;
    changeStatus: FuncWithParam;
    switchFail: FuncEmptyVoid;
    switchWin: FuncEmptyVoid;
}

export interface SnakeProps extends BoardProps {
    baseSizes: BaseSizes;
}

export interface SnakeVisualProps {
    baseSizes: BaseSizes;
}

export interface PauseProps {
    switchPause: FuncEmptyVoid;
}

export interface EndingProps {
    restart: FuncEmptyVoid;
}

export interface SettingsProps {
    switchSettings: FuncEmptyVoid;
}

export interface PanelProps {
    switchSound: FuncEmptyVoid
    switchPause: FuncEmptyVoid;
    switchSettings: FuncEmptyVoid;
}

export interface ControlsProps {
    changeDirection: FuncWithParam;
}