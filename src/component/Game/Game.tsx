import './Game.css';
import Settings from '../Settings/Settings'
import Controls from '../Controls/Controls';
import Pause from '../Pause/Pause';
import Panel from '../Panel/Panel';
import Ending from "../Ending/Ending";
import Board from "../Board/Board";

import useDirection from '../../hooks/useDirection';
import useSound from "../../hooks/useSound";

import {randAB} from "../../service/utils";
import {themeColors} from '../../service/colors';
import {GameStatusList} from "../../types/functionTypes";
import {useActions, useTypedSelector} from "../../hooks/baseHooks";


export default function Game() {
    const isMobile = (document.querySelector('html') as HTMLHtmlElement).offsetWidth < 500;
    const {
        gameStatus,
        backColorIndex,
        scoreInfo
    } = useTypedSelector(state => state.app);
    const {
        setGameStatus,
        setAccentColor,
        setBackColorIndex,
        setScoreInfo,
        increaseSpeed
    } = useActions();


    const {changeDirection} = useDirection();
    const {switchSound, playSound} = useSound();


    function changeStatus(newStatus: GameStatusList) {
        if (['init', 'restart'].includes(newStatus)) {
            changeDirection('right');
            setBackColorIndex(randAB(0, themeColors.length));
            setAccentColor(getAccentColor());
            setScoreInfo('score', 0);
            setScoreInfo('maxScore', Math.ceil(randAB(500, 1000) / 5) * 5);
            setGameStatus(newStatus);
        } else {
            setGameStatus(newStatus);
        }
    }

    function increaseScore() {
        setScoreInfo(
            'score',
            scoreInfo.score + 5,
        )
    }

    function getAccentColor() {
        let hue, saturation, lightness;
        hue = randAB(0, 360) + 'deg';
        saturation = randAB(30, 95) + '%';
        lightness = randAB(30, 45) + '%';
        return `hsl(${hue}, ${saturation}, ${lightness})`;
    }


    return (
        <div className="game" style={{backgroundImage: themeColors[backColorIndex]}}>
            {['init', 'settings'].includes(gameStatus) ?
                <Settings
                    switchSettings={() => changeStatus('move')}/> : null}
            {gameStatus === 'pause' ?
                <Pause
                    switchPause={() => changeStatus('move')}
                /> : null}
            {gameStatus === 'win' || gameStatus === 'fail' ?
                <Ending
                    restart={() => changeStatus('restart')}/> : null}
            <div className={'main-zone' + (!isMobile ? ' centered-part' : '')}>
                <Board
                    changeDirection={changeDirection}
                    playSound={playSound}
                    increaseScore={increaseScore}
                    changeStatus={changeStatus}
                    switchFail={() => changeStatus('fail')}
                    switchWin={() => changeStatus('win')}
                />
                <Panel
                    switchSound={switchSound}
                    switchPause={() => changeStatus('pause')}
                    switchSettings={() => changeStatus('settings')}
                />
            </div>
            {isMobile ?
                <Controls
                    changeDirection={changeDirection}/> : null}
        </div>
    );
}