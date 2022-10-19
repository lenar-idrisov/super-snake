import {RootState} from "../store/reducers";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import actionCreators from '../store/action-creators';


/*export const useTypedSelector = (selector: (state: RootState) => any) =>
    useSelector<RootState>(selector);*/

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(actionCreators, dispatch);
}