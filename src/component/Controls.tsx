import ArrowLeft from "../assets/image/icons/arrowLeft.png";
import ArrowRight from "../assets/image/icons/arrowRight.png";
import ArrowUp from "../assets/image/icons/arrowUp.png";
import ArrowDown from "../assets/image/icons/arrowDown.png";
import {ControlsProps} from "../service/customTypes";

export default function RightMenu(props: ControlsProps) {
    const accentColor = props.accentColor;
    const Control = ({handler, icon} : {handler: () => void, icon: any}) =>
        <button className="control"
                style={{backgroundColor: accentColor}}
                onClick={handler}>
            <img src={icon}/>
        </button>;
    return (
        <div className="controls-wrap">
            <Control icon={ArrowLeft} handler={() => props.changeDirection('left')}/>
            <Control icon={ArrowUp} handler={() => props.changeDirection('up')}/>
            <Control icon={ArrowDown} handler={() => props.changeDirection('down')}/>
            <Control icon={ArrowRight} handler={() => props.changeDirection('right')}/>
        </div>
    );
}