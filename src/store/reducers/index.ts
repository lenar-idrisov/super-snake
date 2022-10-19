import {combineReducers} from "@reduxjs/toolkit";
import {flagsReducer} from "./flagsReducer";

export const rootReducer = combineReducers({
    flags: flagsReducer
})

export type RootState = ReturnType<typeof rootReducer>;