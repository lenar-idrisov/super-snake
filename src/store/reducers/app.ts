import {showError} from "../../service/utils";
import {AppActions, AppState, ListAppActions} from "../types/app";

const initialState: AppState = {
    gameStatus: '',
    accentColor: '',
    backColorIndex: 0,
    scoreInfo: {
        score: 0,
        maxScore: 0,
    },
}


export const appReducer = (state = initialState, action: AppActions): AppState => {
    switch (action.type) {
        case ListAppActions.SET_GAME_STATUS:
            return {...state, gameStatus: action.payload};
        case ListAppActions.SET_ACCENT_COLOR:
            return {...state, accentColor: action.payload};
        case ListAppActions.SET_BACK_COLOR_INDEX:
            return {...state, backColorIndex: action.payload};
        case ListAppActions.SET_SCORE_INFO:
            return {
                ...state,
                scoreInfo: {
                    ...state.scoreInfo,
                    [action.key]: action.payload
                }
            };
        default:
            return state;
    }
}