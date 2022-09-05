import PauseIcon from "../assets/image/windows/pause.png";
import tr from "../service/langManager";
import Play from "../assets/image/icons/play.png";

export default function Pause(props) {
    return (
        <div className="modal">
            <div className="modal-body pause">
                <object data={PauseIcon} className="image"/>
                <button className="main-button"
                        onClick={props.switchPause}
                        style={{backgroundColor: props.accentColor}}>
                    {tr('Играть')}
                    <object data={Play} className="play"/>
                </button>
            </div>
        </div>
    );
}