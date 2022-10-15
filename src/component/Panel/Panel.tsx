import SoundOnIcon from "../../assets/image/icons/soundOn.png";
import SoundOffIcon from "../../assets/image/icons/soundOff.png";
import ThemeDarkIcon from "../../assets/image/icons/themeDark.png";
import ThemeLightIcon from "../../assets/image/icons/themeLight.png";
import Settings from "../../assets/image/icons/settings.png";
import PauseIcon from "../../assets/image/icons/pause.png";
import PlayIcon from "../../assets/image/icons/play.png";
import {PanelProps} from "../../types/customTypes";
import './panel.css';

export default function Panel(props: PanelProps) {
    return (
        <div className="panel">
            <div className="touch">
                <button className="touch-button" onClick={props.switchSound}>
                    <img src={props.isSoundDisable ? SoundOffIcon : SoundOnIcon}/>
                </button>
                <button className="touch-button" onClick={props.switchSettings}>
                    <img src={Settings}/>
                </button>
                <button className="touch-button" onClick={props.switchDarkMode}>
                    <img src={!props.isDarkMode ? ThemeLightIcon : ThemeDarkIcon}/>
                </button>
                <button className="touch-button" onClick={props.switchPause}>
                    <img src={props.gameStatus !== 'pause' ? PauseIcon : PlayIcon}/>
                </button>
                <button className="touch-button" onClick={props.increaseSpeed}>
                    <div className="touch-button_num">{props.speedNum}</div>
                </button>
            </div>
            <div className="indicators">
                <div className="info">
                    <div className="info_num">
                        {props.score}/{props.maxScore}
                    </div>
                </div>
            </div>
        </div>
    );
}