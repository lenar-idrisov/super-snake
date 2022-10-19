import {combineReducers} from "@reduxjs/toolkit";
import {snakeReducer} from "./snakReducer";
import {appReducer} from "./appReducer";

export const rootReducer = combineReducers({
    snake: snakeReducer,
    app: appReducer
})

export type RootState = ReturnType<typeof rootReducer>;