import './pause.css';
import PauseIcon from "../../assets/image/windows/pause.png";
import tr from "../../service/langManager";
import Play from "../../assets/image/icons/play.png";
import {PauseProps} from "../../types/propsTypes";
import {useTypedSelector} from "../../hooks/baseHooks";

export default function Pause(props: PauseProps) {
    const {accentColor} = useTypedSelector(state => state.app);
    return (
        <div className="modal">
            <div className="modal-body pause">
                <object data={PauseIcon} className="image"/>
                <button className="main-button"
                        onClick={props.switchPause}
                        style={{backgroundColor: accentColor}}>
                    {tr('Играть')}
                    <object data={Play} className="play"/>
                </button>
            </div>
        </div>
    );
}