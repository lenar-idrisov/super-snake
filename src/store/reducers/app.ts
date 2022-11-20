import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GameStatusList} from "../../types/functionTypes";
import {AppState} from "../types/states";

const initialState: AppState = {
    gameStatus: '',
    accentColor: '',
    backColorIndex: 0,
    scoreInfo: {
        score: 0,
        maxScore: 0,
    },
}


/*export const appReducer = (state = initialState, action: AppActions): AppState => {
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
}*/


export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setGameStatus(state: AppState, action: PayloadAction<GameStatusList>) {
            state.gameStatus = action.payload;
        },
        setAccentColor(state: AppState, action: PayloadAction<string>) {
            state.accentColor = action.payload;
        },
        setBackColorIndex(state: AppState, action: PayloadAction<number>) {
            state.backColorIndex = action.payload;
        },
        resetScore(state: AppState) {
            state.scoreInfo.score = 0;
        },
        increaseScore(state: AppState) {
            state.scoreInfo.score += 5;
        },
        setMaxScore(state: AppState, action: PayloadAction<number>) {
            state.scoreInfo.maxScore = action.payload;
        },
    }
})

export default appSlice.reducer;