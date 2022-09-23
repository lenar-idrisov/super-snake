import {useState, useEffect, useRef} from 'react';
import Settings from './component/Settings'
import Controls from './component/Controls';
import Pause from './component/Pause';
import Panel from './component/Panel';
import Ending from "./component/Ending";
import Board from "./component/Board";

import useSnakeCourse from './hooks/useDirrection';
import useSound from "./hooks/useSound";
import useSpeed from "./hooks/useSpeed";

import randAB from "./service/utils";
import {themeColors} from './service/colors';
import './scss/App.css';


export default function App(props) {
    const isMobileRef = useRef();
    // init/move/pause/fail/win/settings/restart
    const [status, setStatus] = useState(null);
    // цвет кнопок управления
    const [accentColor, setAccentColor] = useState('');
    // цвет фона игры
    const [backColorIndex, setBackColor] = useState(0);
    const [snakeInfo, setSnakeInfo] = useState(_ => getInitialSnakeInfo());
    const [gameFlags, setGameFlags] = useState({
        isHardMode: false,
        isAdvWatched: false,
        isDarkMode: false,
        isVolumeEnable: true,
    });
    const {deltaXY, changeDirection} = useSnakeCourse();
    const {isSoundEnable, switchSound, playSound} = useSound();
    const {speedNum, realSpeed, increaseSpeed} = useSpeed();


    useEffect(_ => {
        isMobileRef.current = document.querySelector('html').offsetWidth < 500;
    }, [])


    function changeStatus(newStatus) {
        setStatus(newStatus);
        if (newStatus === 'move' && (['init', 'restart'].includes(status))) {
            setTimeout(_ => setStatus(newStatus), 4000);
        } else if (['init', 'restart'].includes(newStatus)) {
            changeDirection('right');
            setBackColor(randAB(0, themeColors.length));
            setAccentColor(getAccentColor());
            setSnakeInfo(getInitialSnakeInfo());
        }
    }

    function getInitialSnakeInfo() {
        return {
            score: 0,
            maxScore: Math.ceil(randAB(500, 1000) / 5) * 5,
        }
    }

    function switchGameFlags(flagName) {
        setGameFlags({
            ...gameFlags,
            [flagName]: !gameFlags[flagName]
        })
    }

    function increaseScore() {
        setSnakeInfo({
            ...snakeInfo,
            score: snakeInfo.score + 5,
        })
    }

    function getAccentColor() {
        let hue, saturation, lightness, accentColor;
        hue = randAB(0, 360) + 'deg';
        saturation = randAB(30, 95) + '%';
        lightness = randAB(30, 45) + '%';
        return  `hsl(${hue}, ${saturation}, ${lightness})`;
    }


    return (
        <div className="game" style={{backgroundImage: themeColors[backColorIndex]}}>
            {status === 'init' || status === 'settings' ?
                <Settings
                    {...gameFlags}
                    advManager={props.advManager}
                    accentColor={accentColor}
                    backColorIndex={backColorIndex}
                    status={status}
                    setBackColor={setBackColor}
                    setAdvWatched={_ => switchGameFlags('isAdvWatched')}
                    switchMode={_ => switchGameFlags('isHardMode')}
                    switchSettings={_ => changeStatus('move')}/> : null}
            {status === 'pause' ?
                <Pause
                    accentColor={accentColor}
                    switchPause={_ => changeStatus('move')}
                /> : null}
            {status === 'win' || status === 'fail' ?
                <Ending
                    advManager={props.advManager}
                    status={status}
                    accentColor={accentColor}
                    restart={_ => changeStatus('restart')}/> : null}
            <div className={'main-zone' + (!isMobileRef.current ? ' centered-part' : '')}>
                <Board
                    {...snakeInfo}
                    {...gameFlags}
                    status={status}
                    deltaXY={deltaXY}
                    realSpeed={realSpeed}
                    changeDirection={changeDirection}
                    playSound={playSound}
                    increaseScore={increaseScore}
                    changeStatus={changeStatus}
                    switchFail={_ => changeStatus('fail')}
                    switchWin={_ => changeStatus('win')}
                />
                <Panel
                    {...snakeInfo}
                    {...gameFlags}
                    speedNum={speedNum}
                    switchSound={switchSound}
                    isSoundEnable={isSoundEnable}
                    increaseSpeed={increaseSpeed}
                    switchDarkMode={_ => switchGameFlags('isDarkMode')}
                    switchPause={_ => changeStatus('pause')}
                    switchSettings={_ => changeStatus('settings')}
                />
            </div>
            {isMobileRef.current ?
                <Controls
                    accentColor={accentColor}
                    changeDirection={changeDirection}/> : null}
        </div>
    );
}