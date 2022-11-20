import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {RootState} from "../store";


/*export const useTypedSelector = (selector: (state: RootState) => any) =>
    useSelector<RootState>(selector);*/

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActionsWithDispatch = (slice: any)  => {
    const dispatch = useDispatch();
    return bindActionCreators(slice.actions, dispatch);
}