import {Action, AppState} from "../../types/customTypes";
import {randAB, showError} from "../../service/utils";

const initialState: AppState = {
    gameStatus: '',
    accentColor: '',
    backColorIndex: 0,
    isSoundDisable: true,
    speedXY: null,
    scoreInfo: {
        score: 0,
        maxScore: 0,
    },
    gameFlags: {
        isHardMode: false,
        isAdvWatched: false,
        isDarkMode: false,
        isSoundDisable: false,
    },
    speed: {
        speedNum: 1,
        real: null
    },
}


export const appReducer = (state = initialState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_GAME_STATUS':
            return {...state, gameStatus: action.payload};
        case 'SET_ACCENT_COLOR':
            return {...state, accentColor: action.payload};
        case 'SET_BACK_COLOR_INDEX':
            return {...state, backColorIndex: action.payload};
        case 'SET_GAME_FLAG':
            return {
                ...state,
                gameFlags: {
                    ...state.gameFlags,
                    ...action.payload
                }
            };
        case 'SET_SCORE_INFO':
            return {
                ...state,
                scoreInfo: {
                    ...state.scoreInfo,
                    ...action.payload
                }
            };
        default:
            showError('неопознанный action ' + action.type);
            return state;
    }
}