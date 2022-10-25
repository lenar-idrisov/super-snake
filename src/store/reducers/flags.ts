import {showError} from "../../service/utils";
import {FlagsState, ListFlagActions, SetFlagAction} from "../types/flags";


const initialState: FlagsState = {
    isHardMode: false,
    isAdvWatched: false,
    isDarkMode: false,
    isSoundDisable: false,
}

export const flagsReducer = (state = initialState, action: SetFlagAction): FlagsState => {
    switch (action.type) {
        case ListFlagActions.SET_GAME_FLAG:
            return {
                ...state,
                [action.flagName]: action.payload
            }
        default:
            return state;
    }
}