import React from 'react';
import {themeColors} from '../service/colors';
import tr from '../service/langManager';

export default function Settings(props) {

    const handleWatchAdvVideo = handler => {
        if (!props.isAdvWatched) {
            props.advManager.showRewardedVideo(
                _ => {
                    props.setAdvWatched();
                    handler();
                },
                _ => {
                    handler();
                }
            );
        } else {
            handler();
        }
    }

    const switchColor = (colorIndex) => {
        const handler = _ => {
            props.setBackgroundColor(colorIndex);
        }
        handleWatchAdvVideo(handler);
    }

    return (
        <div className="modal">
            <div className="modal-body settings">
                <h2 className="title">
                    {tr('Выберите цвет игровой области')}
                </h2>
                <div className="adv-video">
                    {tr('( доступно после рекламы )')}
                </div>
                <div className="colors">
                    {themeColors.map((color, i) =>
                        <div className={'color ' + (i === props.backgroundColorIndex ? 'color-selected' : '')}
                             style={{backgroundImage: color}}
                             onClick={_ => switchColor(i)}
                             num={i}
                             key={'c' + i}>
                        </div>
                    )}
                </div>
                <button className="main-button" style={{backgroundColor: props.accentColor}}
                        onClick={props.switchSettings}>
                    {tr('Старт')}
                </button>
            </div>
        </div>
    )
}
