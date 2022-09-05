import React, {Component} from 'react';
import Settings from './component/Settings'
import Controls from './component/Controls';
import Pause from './component/Pause';
import Panel from './component/Panel';
import Ending from "./component/Ending";
import SnakeZone from "./component/SnakeZone";

import SoundEat from './assets/sound/eat.wav';
import SoundFail from './assets/sound/fail.wav';
import SoundWin from './assets/sound/win.mp3';
import SoundPause from './assets/sound/pause.mp3';

import randAB from "./service/utils";
import {themeColors} from './service/colors';
import './scss/App.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdvWatched: false,
            isDarkMode: false,
            isRoundCells: false, // вид еды и частей змейки (круг/квадрат)
            accentColor: '', // цвет кнопок управления
            backgroundColorIndex: 0,
            volume: true,

            activeStatus: '', // init/snakeMove/pause/fail/win/settings/restart
            snakeCourse: 'right',
            speedNum: 1,
            score: 0,
            maxScore: 0,
        };
        this.screenRef = React.createRef();
    }

    componentDidMount = () => {
        document.addEventListener('keydown', this.keydownHandler);
        // предварительно загружаем звуки
        this.sound = {
            eat: new Audio(SoundEat),
            fail: new Audio(SoundFail),
            win: new Audio(SoundWin),
            pause: new Audio(SoundPause),
        };
        this.setActiveStatus('init');
        //TODO: дубль убрать в SnakeZone
        const body = document.querySelector('html');
        const device = {
            width: body.offsetWidth,
            height: body.offsetHeight
        }
        this.isMobile = device.width < 500;
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydownHandler);
    }

    setActiveStatus = (windowName) => {
        this.setState({activeStatus: windowName});
        if (windowName === 'init' || windowName === 'restart') {
            this.setBackgroundColor(randAB(0, themeColors.length));
            this.setAccentColor();
            this.setState({
                snakeCourse: 'right',
                score: 0,
                maxScore: Math.ceil(randAB(500, 1000) / 5) * 5,
            });
        }
    }

    keydownHandler = (event) => {
        let snakeCourse;
        if (event.code === 'ArrowUp') {
            snakeCourse = 'up';
        }
        if (event.code === 'ArrowDown') {
            snakeCourse = 'down';
        }
        if (event.code === 'ArrowRight') {
            snakeCourse = 'right';
        }
        if (event.code === 'ArrowLeft') {
            snakeCourse = 'left';
        }
        this.setState({snakeCourse})
    }

    setAdvWatched = _ => {
        this.setState({isAdvWatched: true});
    }

    changeCourse = snakeCourse => {
        this.setState({snakeCourse});
    }

    switchDarkMode = _ =>
        this.setState({isDarkMode: !this.state.isDarkMode});

    switchCellKind = _ =>
        this.setState({isRoundCells: !this.state.isRoundCells});

    switchVolume = () => {
        this.setState({volume: !this.state.volume});
        for (const key in this.sound) {
            this.sound[key].volume = this.state.volume ? 0 : 1;
        }
    }

    setBackgroundColor = (colorIndex) =>
        this.setState({backgroundColorIndex: colorIndex})

    setAccentColor = _ => {
        let hue, saturation, lightness, accentColor;
        hue = randAB(0, 360) + 'deg';
        saturation = randAB(30, 90) + '%';
        lightness = randAB(30, 45) + '%';
        accentColor = `hsl(${hue}, ${saturation}, ${lightness})`;
        this.setState({accentColor})
    }

    playSound = (name) => {
        this.sound[name].currentTime = 0;
        this.sound[name].play();
    }

    increaseScore = () => {
        this.setState({score: this.state.score += 5});
    }

    changeSpeed = _ => {
        let speedNum = this.state.speedNum;
        if (speedNum <= 3) {
            speedNum++;
        } else speedNum = 1;
        this.setState({speedNum});
    }

    render() {
        const state = this.state;
        let {
            activeStatus,
            snakeCourse,
            isDarkMode,
            isRoundCells,
            accentColor,
            backgroundColorIndex,
            speedNum,
            score,
            maxScore,
            isAdvWatched
        } = this.state;

        return (
            <div className="game" style={{backgroundImage: themeColors[backgroundColorIndex]}}>
                {activeStatus === 'init' || activeStatus === 'settings' ?
                    <Settings
                        accentColor={accentColor}
                        isAdvWatched={isAdvWatched}
                        advManager={this.props.advManager}
                        backgroundColorIndex={backgroundColorIndex}
                        setBackgroundColor={this.setBackgroundColor}
                        setAdvWatched={this.setAdvWatched}
                        switchSettings={_ => this.setActiveStatus('snakeMove')}/> : null}
                {activeStatus === 'pause' ?
                    <Pause
                        accentColor={accentColor}
                        switchPause={_ => this.setActiveStatus('snakeMove')}
                    /> : null}
                {activeStatus === 'win' || activeStatus === 'fail' ?
                    <Ending
                        advManager={this.props.advManager}
                        activeStatus={activeStatus}
                        accentColor={accentColor}
                        restart={_ => this.setActiveStatus('restart')}/> : null}
                <div className={'main-part' + (!this.isMobile ? ' centered-part' : '')}>
                    <div className='snake'>
                        <div className="left-zone">
                            <SnakeZone
                                switchFail={_ => this.setActiveStatus('fail')}
                                switchWin={_ => this.setActiveStatus('win')}
                                isRoundCells={isRoundCells}
                                isDarkMode={isDarkMode}
                                activeStatus={activeStatus}
                                score={score}
                                speedNum={speedNum}
                                snakeCourse={snakeCourse}
                                maxScore={maxScore}
                                playSound={this.playSound}
                                increaseScore={this.increaseScore}
                            />
                            {!this.isMobile ?
                                <Controls
                                    accentColor={accentColor}
                                    changeCourse={this.changeCourse} /> : null}
                        </div>
                        <Panel
                            {...state}
                            switchVolume={this.switchVolume}
                            speedNum={speedNum}
                            changeSpeed={this.changeSpeed}
                            switchCellKind={this.switchCellKind}
                            switchDarkMode={this.switchDarkMode}
                            switchPause={_ => this.setActiveStatus('pause')}
                            switchSettings={_ => this.setActiveStatus('settings')}
                        />
                    </div>
                </div>
                {this.isMobile ?
                    <div className="controls-wrap-mobile">
                        <Controls
                            accentColor={accentColor}
                            changeCourse={this.changeCourse} />
                    </div> : null}
            </div>
        );
    }
}