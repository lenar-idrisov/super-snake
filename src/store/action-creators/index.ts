import FlagsActionCreator from '../action-creators/flags';
import AppActionCreator from '../action-creators/app';
import SnakeMoreActionCreator from "./snakeMore";

export default {
    ...FlagsActionCreator,
    ...AppActionCreator,
    ...SnakeMoreActionCreator,
}