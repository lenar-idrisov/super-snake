import {useEffect} from 'react';
import {FoodOne} from "../../types/functionTypes";
import {useActions, useTypedSelector} from "../../hooks/baseHooks";
import useFood from "../../hooks/useFood";
import useBarriers from "../../hooks/useBarriers";
import SnakeVisual from "./SnakeVisual";
import {SnakeProps} from "../../types/propsTypes";
import usePrev from "../../hooks/usePrev";


export default function Snake(props: SnakeProps) {
    const {foodList, getFoodList} = useFood(props.baseSizes);
    const {barriers, getBarriers} = useBarriers(props.baseSizes);

    const {gameStatus, scoreInfo} = useTypedSelector(state => state.app);
    const {snake,speedNum, shiftXY} = useTypedSelector(state => state.snake);
    const {updateSnake, updateBarriers, updateFood} = useActions();
    const {isValChanged: isDirectionChanged} = usePrev(shiftXY);


    // инициация и остановка/запуск змейки при открытии модальных окон
    useEffect(() => {
        if (['init', 'restart'].includes(gameStatus)) {
            const {cellSize} = props.baseSizes;
            const newSnake = [
                {x: 2, y: 10},
                {x: 1, y: 10},
                {x: 0, y: 10},
            ].map(cell => ({
                x: cell.x * cellSize,
                y: cell.y * cellSize,
                color: 'grey'
            }));
            // здесь обновляем еду и барьеры, змейку, а не в отдельных хуках useFood useBarriers
            // т.к. они сильно взаимосвязаны и должны знать о расположении друг друга
            const newFoodList = getFoodList(newSnake);
            const newBarriers = getBarriers(newSnake, newFoodList);
            updateSnake(newSnake);
            updateFood(newFoodList);
            updateBarriers(newBarriers);

            if (gameStatus === 'restart') {
                // запускаем, не показывая окно настроек
                props.changeStatus('move');
            }
        } else if (['pause', 'fail', 'win', 'settings'].includes(gameStatus)) {
            setSnakeMove(false);
        } else if (gameStatus === 'move') {
            setSnakeMove(true);
        }
    }, [gameStatus]);


    // управляет движением змейки
    useEffect(() => {
        if (gameStatus !== 'move') return;
        if (isDirectionChanged) {
            // запускает змею после смены курса
            moveSnake();
        } else {
            // двигает змею вперед
            setSnakeMove(true);
        }
        return () => setSnakeMove(false);
    }, [snake, shiftXY])


    function setSnakeMove(isMove: boolean) {
        clearTimeout((window as any).snakeMoveTimerId);
        if (isMove) {
            // таймер, управляющий движением змейки
            (window as any).snakeMoveTimerId = setTimeout(
                () => moveSnake(),
                getRealSpeed(speedNum)
            );
        }
    }

    function moveSnake() {
        let newSnake = [...snake];
        let newFoodList = [...foodList];
        const {cellSize} = props.baseSizes;
        let {dx, dy} = shiftXY;
        dx *= cellSize;
        dy *= cellSize;
        let head = {
            x: newSnake[0].x + dx,
            y: newSnake[0].y + dy,
            color: newSnake[1].color
        };
        let isWall = checkWall(head.x, head.y);
        let eaten!: FoodOne;

        newFoodList.forEach(e => {
            if (head.x === e.x && head.y === e.y) {
                eaten = e;
            }
        })

        // больше предохранитель, чем необходимость
        if (eaten) {
            props.increaseScore();
            if (scoreInfo.score >= scoreInfo.maxScore) {
                props.switchWin();
                props.playSound('win');
            } else {
                newSnake.unshift(head);
                newSnake = newSnake.map(cell => ({
                    ...cell,
                    color: eaten.i,
                }));
                props.playSound('eat');
                updateSnake(newSnake);
            }
        } else {
            if (isWall) {
                props.switchFail();
                props.playSound('fail');
                window.navigator?.vibrate(300);
            } else {
                newSnake.unshift(head);
                newSnake.pop();
                updateSnake(newSnake);
            }
        }
    }

    /**
     @param {number} headX координата x головы змейки
     @param {number} headY координата y головы змейки
     * */
    function checkWall(headX: number, headY: number) {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        // проверяем, не ударилась ли змея о саму себя
        for (let i = 3; i < snake.length; i++) {
            if (headX === snake[i].x && headY === snake[i].y) {
                return true;
            }
        }
        // проверяем, не ударилась ли змея о стену
        if (headX < 0 || headX > activeWidth - cellSize ||
            headY < 0 || headY > activeHeight - cellSize) {
            return true
        }
        // проверяем, не ударилась ли змея о барьеры
        return barriers.flat().some(cell => (headX === cell.x && headY === cell.y));
    }

    function getRealSpeed(speedNum: number) {
        let speedResult = 290;
        if (speedNum === 2) {
            speedResult = 250;
        } else if (speedNum === 3) {
            speedResult = 200;
        } else if (speedNum === 4) {
            speedResult = 150;
        }
        return speedResult;
    }

    return (
        <SnakeVisual
            baseSizes={props.baseSizes}/>
    );
}