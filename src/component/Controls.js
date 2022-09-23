import ArrowLeft from "../assets/image/icons/arrowLeft.png";
import ArrowRight from "../assets/image/icons/arrowRight.png";
import ArrowUp from "../assets/image/icons/arrowUp.png";
import ArrowDown from "../assets/image/icons/arrowDown.png";

export default function RightMenu(props) {
    const accentColor = props.accentColor;
    const Control = ({handler, icon}) =>
        <button className="control"
                style={{backgroundColor: accentColor}}
                onClick={handler}>
            <img src={icon}/>
        </button>;
    return (
        <div className="controls-wrap">
            <Control icon={ArrowLeft} handler={_ => props.changeDirection('left')}/>
            {/*{props.isMobile ?
                <button className='control' style={{backgroundColor: accentColor}}
                        onPointerDown={props.accelerate_start}
                        onPointerUp={props.accelerate_end}
                        onPointerLeave={props.accelerate_end}>
                    <img src={ArrowDown}/>
                </button> : null}*/}
            <Control icon={ArrowUp} handler={_ => props.changeDirection('up')}/>
            <Control icon={ArrowDown} handler={_ => props.changeDirection('down')}/>
            <Control icon={ArrowRight} handler={_ => props.changeDirection('right')}/>
        </div>
    );
}