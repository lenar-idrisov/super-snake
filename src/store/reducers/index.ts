import {combineReducers} from "@reduxjs/toolkit";
import {flagsReducer} from "./flags";
import {appReducer} from "./app";
import {snakeMoreReducer} from "./snakeMore";

export const rootReducer = combineReducers({
    flags: flagsReducer,
    app: appReducer,
    snake: snakeMoreReducer,
})

export type RootState = ReturnType<typeof rootReducer>;