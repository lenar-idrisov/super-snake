import React from 'react';
import {themeColors} from '../service/colors';
import tr from '../service/langManager';

export default function Settings(props) {
    const showAfterWatchAdv = (callback) => {
        if (!props.isAdvWatched) {
            props.advManager.showRewardedVideo(
                _ => {
                    props.setAdvWatched();
                    callback();
                },
                _ => {
                    callback();
                }
            );
        } else {
            callback();
        }
    }
    const switchMode = isHardMode => {
        showAfterWatchAdv(_ => {
            if ((isHardMode && !props.isHardMode) || (!isHardMode && props.isHardMode)) {
                props.switchMode();
            }
        });
    }

    const switchBackColor = colorIndex => {
        showAfterWatchAdv(_ => props.setBackColor(colorIndex));
    }


    const getOption = (comment, isHardMode) => {
        const isActive = isHardMode ? (props.isHardMode) : (!props.isHardMode);
        return (
            <div className="input-container">
                <div className={'switcher' + (isActive ? ' switcher-checked' : '')}
                     style={{backgroundColor: isActive ? props.accentColor : ''}}
                     onClick={_ => switchMode(isHardMode)}>
                </div>
                <div className="comment" onClick={_ => switchMode(isHardMode)}>
                    {tr(comment)}
                </div>
            </div>
        )
    };

    return (
        <div className="modal">
            <div className="modal-body settings">
                {props.status === 'init' || props.status === 'restart' ?
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
                            <div className={'color ' + (i === props.backColorIndex ? 'color-selected' : '')}
                                 style={{backgroundImage: color}}
                                 onClick={_ => switchBackColor(i)}
                                 key={'c' + i}>
                            </div>
                        )}
                    </div>
                </div>
                <button className="main-button" style={{backgroundColor: props.accentColor}}
                        onClick={props.switchSettings}>
                    {tr('Старт')}
                </button>
            </div>
        </div>
    )
}
