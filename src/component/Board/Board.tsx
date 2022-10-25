import {useContext, useEffect, useRef} from 'react';
import {BoardProps} from "../../types/propsTypes";
import {BaseSizes} from "../../types/functionTypes";
import {AdvContext} from "../../index";
import {useTypedSelector} from "../../hooks/baseHooks";
import Snake from "../Snake/Snake";

export default function Board(props: BoardProps) {
    // разеры клеточной зоны, где ходит змея
    // (ширина высота зоны, кол-во клеток, размер клетки)
    const {gameStatus} = useTypedSelector(state => state.app);
    const baseSizesRef = useRef<BaseSizes>();
    const advManager = useContext(AdvContext);

    useEffect(() => {
        baseSizesRef.current = getCalculatedSizes();
        props.changeStatus('init');
    }, []);

    useEffect(() => {
        const showPause = () => {
            if (gameStatus === 'move') {
                setTimeout(_ => {
                    advManager.showFullscreenAdv()
                    props.changeStatus('pause');
                }, 300);
            }
        }
        const showAdv = () => {
            if (gameStatus === 'move') {
                props.changeStatus('pause');
                advManager.showAdvBeforeExit(true)
            }
        }
        const subscribe = () => {
            // реклама при покидании вкладки
            window.addEventListener('blur', showPause);
            // реклама при выходе из игры
            window.addEventListener('resize', showAdv);
        }
        const unSubscribe = () => {
            // реклама при покидании вкладки
            window.removeEventListener('blur', showPause);
            // реклама при выходе из игры
            window.removeEventListener('resize', showAdv);
        }
        subscribe()
        return () => unSubscribe();
    }, [gameStatus])

    // исходя из ширины экрана рассчитываем размер клеточки зоны
    function getCalculatedSizes() {
        const body = document.querySelector('html') as HTMLHtmlElement;
        const device = {
            width: body.offsetWidth,
            height: body.offsetHeight
        }
        const scale = 1;
        const isMobile = device.width < 500;
        const cellBase = isMobile ? 26 : (device.height < 900 ? 34 : 32);

        const heightPart = isMobile ? 0.75 : 0.92;
        const widthPart = isMobile ? 8.6 / 20 : 9.5 / 16;

        const cellSize = Math.round(cellBase * scale * device.height / 960);
        const activeHeight = Math.round(device.height * heightPart / cellSize) * cellSize;
        const activeWidth = Math.round(activeHeight * widthPart / cellSize) * cellSize;
        const cellQuantity = Math.round(activeWidth * activeHeight / (cellSize * cellSize));

        return {
            cellSize,
            activeHeight,
            activeWidth,
            cellQuantity,
        }
    }


    if (!baseSizesRef.current) return null;

    return (
        <Snake
            {...props}
            baseSizes={baseSizesRef.current}
        />
    );
}