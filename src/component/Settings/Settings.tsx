import './settings.css';
import {useContext} from 'react';
import {themeColors} from '../../service/colors';
import tr from '../../service/langManager';
import {AdvContext} from "../../index";
import {SettingsProps} from "../../types/propsTypes";
import {useActionsWithDispatch, useTypedSelector} from "../../hooks/baseHooks";
import {flagSlice} from "../../store/reducers/flags";
import {appSlice} from "../../store/reducers/app";

export default function Settings(props: SettingsProps) {
    const advManager = useContext(AdvContext);
    const {isHardMode, isAdvWatched} = useTypedSelector(state => state.flags);
    const {gameStatus, accentColor, backColorIndex} = useTypedSelector(state => state.app);
    const {setBackColorIndex} = useActionsWithDispatch(appSlice);
    const {switchAdvWatched, switchHardMode} = useActionsWithDispatch(flagSlice);

    const showAfterWatchAdv = (callback: Function) => {
        if (!isAdvWatched) {
            advManager.showRewardedVideo(
                () => {
                    switchAdvWatched();
                    callback();
                },
                () => {
                    callback();
                }
            );
        } else {
            callback();
        }
    }
    const switchMode = (isHardModeOption: boolean) => {
        showAfterWatchAdv(() => {
            if (isHardModeOption !== isHardMode) {
                switchHardMode();
            }
        });
    }

    const switchBackColor = (colorIndex: number) => {
        showAfterWatchAdv(() => setBackColorIndex(colorIndex));
    }


    const getOption = (comment: string, isHardModeOption: boolean) => {
        const isActive = isHardModeOption === isHardMode;
        return (
            <div className="input-container">
                <div className={'switcher' + (isActive ? ' switcher-checked' : '')}
                     style={{backgroundColor: isActive ? accentColor : ''}}
                     onClick={() => switchMode(isHardModeOption)}>
                </div>
                <div className="comment" onClick={() => switchMode(isHardModeOption)}>
                    {tr(comment)}
                </div>
            </div>
        )
    };

    return (
        <div className="modal">
            <div className="modal-body settings">
                {['init', 'restart'].includes(gameStatus) ?
                    <div className="mode-part">
                        <h2 className='title'>
                            {tr('Выбери режим игры')}
                        </h2>
                        {getOption('без барьеров', false)}
                        {getOption('с барьерами', true)}
                    </div> : null}

                <div className="colors-part">
                    <h2 className="title">
                        {tr('Выберите цвет игровой области')}
                    </h2>
                    <div className="adv-video">
                        {tr('( доступно после рекламы )')}
                    </div>
                    <div className="colors">
                        {themeColors.map((color, i) =>
                            <div className={'color ' + (i === backColorIndex ? 'color-selected' : '')}
                                 style={{backgroundImage: color}}
                                 onClick={() => switchBackColor(i)}
                                 key={'c' + i}>
                            </div>
                        )}
                    </div>
                </div>
                <button className="main-button" style={{backgroundColor: accentColor}}
                        onClick={props.switchSettings}>
                    {tr('Старт')}
                </button>
            </div>
        </div>
    )
}
