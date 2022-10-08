import {useState, useEffect, useRef} from 'react';
import Settings from './component/Settings'
import Controls from './component/Controls';
import Pause from './component/Pause';
import Panel from './component/Panel';
import Ending from "./component/Ending";
import Board from "./component/Board";

import useDirection from './hooks/useDirection';
import useSound from "./hooks/useSound";
import useSpeed from "./hooks/useSpeed";

import randAB from "./service/utils";
import {themeColors} from './service/colors';
import './scss/App.css';
import {AppProps, GameFlags} from "./service/customTypes";


export default function App({advManager, isMobile}: AppProps) {
    // init/move/pause/fail/win/settings/restart
    const [gameStatus, setStatus] = useState('');
    // цвет кнопок управления
    const [accentColor, setAccentColor] = useState('');
    // цвет фона игры
    const [backColorIndex, setBackColor] = useState(0);
    const [scoreInfo, setScoreInfo] = useState(() => getInitialScoreInfo());
    const [gameFlags, setGameFlags] = useState<GameFlags>({
        isHardMode: false,
        isAdvWatched: false,
        isDarkMode: false,
    });
    const {speedNum, realSpeed, increaseSpeed} = useSpeed();
    const {dir, speedDXDY, changeDirection} = useDirection();
    const {isSoundEnable, switchSound, playSound} = useSound();


    function changeStatus(newStatus: string) {
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

    function switchGameFlags(flagName: string) {
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
                    advManager={advManager}
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
                    advManager={advManager}
                    gameStatus={gameStatus}
                    accentColor={accentColor}
                    restart={() => changeStatus('restart')}/> : null}
            <div className={'main-zone' + (!isMobile ? ' centered-part' : '')}>
                <Board
                    {...scoreInfo}
                    {...gameFlags}
                    advManager={advManager}
                    gameStatus={gameStatus}
                    speedDXDY={speedDXDY}
                    dir={dir}
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
                    speedNum={speedNum}
                    isSoundEnable={isSoundEnable}
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