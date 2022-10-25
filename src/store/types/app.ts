import {GameStatusList} from "../../types/functionTypes";

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

export enum ListAppActions {
    SET_GAME_STATUS='APP.SET_GAME_STATUS',
    SET_ACCENT_COLOR='APP.SET_ACCENT_COLOR',
    SET_BACK_COLOR_INDEX='APP.SET_BACK_COLOR_INDEX',
    SET_SCORE_INFO='APP.SET_SCORE_INFO',
}

export interface SetGameStatusAction {
    type: typeof ListAppActions.SET_GAME_STATUS;
    payload: AppState['gameStatus'];
}

export interface SetAccentColorAction {
    type: typeof ListAppActions.SET_ACCENT_COLOR;
    payload: string
}

export interface SetBackColorIndexAction {
    type: typeof ListAppActions.SET_BACK_COLOR_INDEX;
    payload: number
}
export interface SetScoreInfoAction {
    type: typeof ListAppActions.SET_SCORE_INFO;
    key: keyof AppState['scoreInfo'];
    payload: number
}

export type AppActions =
    SetGameStatusAction |
    SetAccentColorAction |
    SetBackColorIndexAction |
    SetScoreInfoAction