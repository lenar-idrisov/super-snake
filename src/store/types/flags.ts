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

export enum ListFlagActions {
    SET_GAME_FLAG='FLAGS.SET_GAME_FLAG',
}

export interface SetFlagAction {
    type: typeof ListFlagActions.SET_GAME_FLAG;
    flagName: keyof FlagsState;
    payload: any
}