import {GameStatusList} from "../../types/functionTypes";
import {
    AppState,
    ListAppActions,
    SetAccentColorAction,
    SetBackColorIndexAction,
    SetGameStatusAction,
    SetScoreInfoAction
} from "../types/app";

export default {
    setGameStatus: (payload: GameStatusList): SetGameStatusAction => ({
        type: ListAppActions.SET_GAME_STATUS,
        payload,
    }),

    setAccentColor: (payload: string): SetAccentColorAction => ({
        type: ListAppActions.SET_ACCENT_COLOR,
        payload,
    }),

    setBackColorIndex: (payload: number): SetBackColorIndexAction => ({
        type: ListAppActions.SET_BACK_COLOR_INDEX,
        payload,
    }),

    setScoreInfo: (key: keyof AppState['scoreInfo'], payload: number): SetScoreInfoAction => ({
        type: ListAppActions.SET_SCORE_INFO,
        key,
        payload,
    }),
}