import {useState} from 'react';
import Settings from '../Settings/Settings'
import Controls from '../Controls/Controls';
import Pause from '../Pause/Pause';
import Panel from '../Panel/Panel';
import Ending from "../Ending/Ending";
import Board from "../Board/Board";

import useDirection from '../../hooks/useDirection';
import useSound from "../../hooks/useSound";
import useSpeed from "../../hooks/useSpeed";

import {randAB} from "../../service/utils";
import {themeColors} from '../../service/colors';
import {GameStatusList} from "../../types/functionTypes";
import './Game.css';


export default function Game() {
    const isMobile = (document.querySelector('html') as HTMLHtmlElement).offsetWidth < 500;
    const [gameStatus, setStatus] = useState('');
    // цвет кнопок управления
    const [accentColor, setAccentColor] = useState('');
    // цвет фона игры
    const [backColorIndex, setBackColor] = useState(0);

    const [scoreInfo, setScoreInfo] = useState(() => getInitialScoreInfo());
    const [gameFlags, setGameFlags] = useState<any>({
        isHardMode: false,
        isAdvWatched: false,
        isDarkMode: false,
        isSoundDisable: false,
    });
    const {speedNum, realSpeed, increaseSpeed} = useSpeed();
    const {speedXY, changeDirection} = useDirection();
    const {switchSound, playSound} = useSound();


    function changeStatus(newStatus: GameStatusList) {
        if (['init', 'restart'].includes(newStatus)) {
            changeDirection('right');
            setBackColor(randAB(0, themeColors.length));
            setAccentColor(getAccentColor());
            setScoreInfo(getInitialScoreInfo());
            setStatus(newStatus);
        } else {
            setStatus(newStatus);
        }
    }

    function getInitialScoreInfo() {
        return {
            score: 0,
            maxScore: Math.ceil(randAB(500, 1000) / 5) * 5,
        }
    }

    function switchGameFlags(flagName: any) {
        setGameFlags({
            ...gameFlags,
            [flagName]: !(gameFlags[flagName])
        })
    }

    function increaseScore() {
        setScoreInfo({
            ...scoreInfo,
            score: scoreInfo.score + 5,
        })
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
            {gameStatus === 'init' || gameStatus === 'settings' ?
                <Settings
                    {...gameFlags}
                    accentColor={accentColor}
                    backColorIndex={backColorIndex}
                    gameStatus={gameStatus}
                    setBackColor={setBackColor}
                    setAdvWatched={() => switchGameFlags('isAdvWatched')}
                    switchMode={() => switchGameFlags('isHardMode')}
                    switchSettings={() => changeStatus('move')}/> : null}
            {gameStatus === 'pause' ?
                <Pause
                    accentColor={accentColor}
                    switchPause={() => changeStatus('move')}
                /> : null}
            {gameStatus === 'win' || gameStatus === 'fail' ?
                <Ending
                    gameStatus={gameStatus}
                    accentColor={accentColor}
                    restart={() => changeStatus('restart')}/> : null}
            <div className={'main-zone' + (!isMobile ? ' centered-part' : '')}>
                <Board
                    {...scoreInfo}
                    {...gameFlags}
                    gameStatus={gameStatus}
                    speedXY={speedXY}
                    realSpeed={realSpeed}
                    changeDirection={changeDirection}
                    playSound={playSound}
                    increaseScore={increaseScore}
                    changeStatus={changeStatus}
                    switchFail={() => changeStatus('fail')}
                    switchWin={() => changeStatus('win')}
                />
                <Panel
                    {...scoreInfo}
                    {...gameFlags}
                    gameStatus={gameStatus}
                    speedNum={speedNum}
                    switchSound={switchSound}
                    increaseSpeed={increaseSpeed}
                    switchDarkMode={() => switchGameFlags('isDarkMode')}
                    switchPause={() => changeStatus('pause')}
                    switchSettings={() => changeStatus('settings')}
                />
            </div>
            {isMobile ?
                <Controls
                    accentColor={accentColor}
                    changeDirection={changeDirection}/> : null}
        </div>
    );
}