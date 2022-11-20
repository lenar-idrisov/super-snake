import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FlagsState} from "../types/states";


const initialState: FlagsState = {
    isHardMode: false,
    isAdvWatched: false,
    isDarkMode: false,
    isSoundDisable: false,
}

/*export const flagsReducer = (state = initialState, action: SetFlagAction): FlagsState => {
    switch (action.type) {
        case ListFlagActions.SET_GAME_FLAG:
            return {
                ...state,
                [action.flagName]: action.payload
            }
        default:
            return state;
    }
}*/


export const flagSlice = createSlice({
    name: 'flags',
    initialState,
    reducers: {
        switchHardMode(state: FlagsState, action: PayloadAction<boolean>) {
            state.isHardMode = action.payload;
        },
        switchAdvWatched(state: FlagsState, action: PayloadAction<boolean>) {
            state.isAdvWatched = action.payload;
        },
        switchDarkMode(state: FlagsState) {
            state.isDarkMode = !state.isDarkMode;
        },
        switchSoundEnable(state: FlagsState, action: PayloadAction<boolean>) {
            state.isSoundDisable = action.payload;
        },

    }
})

export default flagSlice.reducer;