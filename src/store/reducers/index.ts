import {combineReducers} from "@reduxjs/toolkit";
import {snakeReducer} from "./snakeReduce";
import {appReducer} from "./appReducer";

export const rootReducer = combineReducers({
    snake: snakeReducer,
    app: appReducer
})