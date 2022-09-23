import React from 'react';
import tr from '../service/langManager'

import WinEnd from '../assets/image/windows/win.png'
import FailEnd from '../assets/image/windows/fail.png'
import MoreGame from '../assets/image/windows/moreGame.png'

export default function Ending(props) {
    return (
        <div className="modal">
            <div className="ending">
                <div className="window top-window">
                    <div className="card card-pink" onClick={props.advManager.openOtherGame}>
                        <object data={MoreGame} className="image"/>
                    </div>
                    <button className="main-button"
                            style={{backgroundColor: props.accentColor}}
                            onClick={props.advManager.openOtherGame}>
                        {tr('Другая игра')}
                    </button>
                </div>
                <div className="window bottom-window">
                    <object data={props.status === 'win' ? WinEnd : FailEnd}
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