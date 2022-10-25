import './panel.css';
import SoundOnIcon from "../../assets/image/icons/soundOn.png";
import SoundOffIcon from "../../assets/image/icons/soundOff.png";
import ThemeDarkIcon from "../../assets/image/icons/themeDark.png";
import ThemeLightIcon from "../../assets/image/icons/themeLight.png";
import Settings from "../../assets/image/icons/settings.png";
import PauseIcon from "../../assets/image/icons/pause.png";
import PlayIcon from "../../assets/image/icons/play.png";
import {PanelProps} from "../../types/propsTypes";
import {useActions, useTypedSelector} from "../../hooks/baseHooks";

export default function Panel(props: PanelProps) {
    const {isDarkMode, isSoundDisable} = useTypedSelector(state => state.flags);
    const {scoreInfo, gameStatus} = useTypedSelector(state => state.app);
    const {setGameFlag, increaseSpeed} = useActions();
    const {speedNum} = useTypedSelector(state => state.snake);
    const switchDarkMode = () => setGameFlag('isDarkMode', !isDarkMode);


    return (
        <div className="panel">
            <div className="touch">
                <button className="touch-button" onClick={props.switchSound}>
                    <img src={isSoundDisable ? SoundOffIcon : SoundOnIcon}/>
                </button>
                <button className="touch-button" onClick={props.switchSettings}>
                    <img src={Settings}/>
                </button>
                <button className="touch-button" onClick={switchDarkMode}>
                    <img src={isDarkMode ? ThemeLightIcon : ThemeDarkIcon}/>
                </button>
                <button className="touch-button" onClick={props.switchPause}>
                    <img src={gameStatus !== 'pause' ? PauseIcon : PlayIcon}/>
                </button>
                <button className="touch-button" onClick={increaseSpeed}>
                    <div className="touch-button_num">{speedNum}</div>
                </button>
            </div>
            <div className="indicators">
                <div className="info">
                    <div className="info_num">
                        {scoreInfo.score}/{scoreInfo.maxScore}
                    </div>
                </div>
            </div>
        </div>
    );
}