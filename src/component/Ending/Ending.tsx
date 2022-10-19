import React, {useContext} from 'react';
import tr from '../../service/langManager'
import {EndingProps} from "../../types/propsTypes";

import WinEnd from '../../assets/image/windows/win.png'
import FailEnd from '../../assets/image/windows/fail.png'
import MoreGame from '../../assets/image/windows/moreGame.png'
import {AdvContext} from "../../index";
import './ending.css';

export default function Ending(props: EndingProps) {
    const advManager = useContext(AdvContext);
    return (
        <div className="modal">
            <div className="ending">
                <div className="window top-window">
                    <div className="card card-pink" onClick={advManager.openOtherGame}>
                        <object data={MoreGame} className="image"/>
                    </div>
                    <button className="main-button"
                            style={{backgroundColor: props.accentColor}}
                            onClick={advManager.openOtherGame}>
                        {tr('Другая игра')}
                    </button>
                </div>
                <div className="window bottom-window">
                    <object data={props.gameStatus === 'win' ? WinEnd : FailEnd}
                            className="image"/>
                    <button className="main-button"
                            style={{backgroundColor: props.accentColor}}
                            onClick={props.restart}>
                        {tr('Играть еще')}
                    </button>
                </div>
            </div>
        </div>
    )
}