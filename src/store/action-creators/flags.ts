import {FlagsState, ListFlagActions, SetFlagAction} from "../types/flags";

export default {
    setGameFlag: (
        flagName: keyof FlagsState,
        payload: boolean
    ): SetFlagAction => ({
        type: ListFlagActions.SET_GAME_FLAG,
        flagName,
        payload,
    })
}