import {combineReducers, configureStore} from "@reduxjs/toolkit";
import flagsReducer from "./reducers/flags";
import appReducer from "./reducers/app";
import snakeMoreReducer from "./reducers/snakeMore";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
    flags: flagsReducer,
    app: appReducer,
    snake: snakeMoreReducer,
})


export const store = configureStore({
    reducer: rootReducer
});
