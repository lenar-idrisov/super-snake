import {useState, useEffect, useRef} from 'react';
import randAB from "../service/utils";
import {snakeColors} from "../service/colors";
import barriersScheme from "../service/barriersScheme";
import {getReadyStyles} from "../service/helpers";

export default function SnakeLive(props) {
    const prevDirRef = useRef();
    // горизонтальная и вертикальная скорости
    const [snakeLive, setSnakeLive] = useState({
        snake: [],
        foodList: [],
        barriers: []
    });

    useEffect(_ => {
        if (['init', 'restart'].includes(props.status)) {
            const {cellSize} = props.baseSizes;
            const snake = [
                {x: 2, y: 10},
                {x: 1, y: 10},
                {x: 0, y: 10},
            ].map(cell => ({
                x: cell.x * cellSize,
                y: cell.y * cellSize,
                color: 'grey'
            }));
            const barriers = props.isHardMode ? getBarriers(snake, []) : [];
            const foodList = getFoodList(snake, barriers);

            setSnakeLive({
                foodList,
                barriers,
                snake
            });
            if (props.status === 'restart') {
                // запускаем, не показывая окно настроек
                props.changeStatus('move');
            }
        } else if (['pause', 'fail', 'win', 'settings'].includes(props.status)) {
            setSnakeMove(false);
        } else if (props.status === 'move') {
            setSnakeMove(true);
        }
    }, [props.status]);

    useEffect(_ => {
        // если ниче не поменялось - просто выходим
        if ((props.isHardMode && snakeLive.barriers.length) ||
            (!props.isHardMode && !snakeLive.barriers.length)) return;
        setSnakeLive({
            ...snakeLive,
            barriers: props.isHardMode ?
                getBarriers(snakeLive.snake, snakeLive.foodList) : []
        });
    }, [props.isHardMode])


    useEffect(_ => {
        if (props.status !== 'move') return;
        if (!prevDirRef.current) prevDirRef.current = props.dir;
        if (prevDirRef.current !== props.dir) {
            // запускает змею после смены курса
            moveSnake();
        } else {
            // двигает змею вперед
            setSnakeMove(true);
        }
        prevDirRef.current = props.dir;
        return _ => setSnakeMove(false);
    }, [snakeLive, props.dir])

    function setSnakeMove(isMove) {
        clearTimeout(window.snakeMoveTimerId);
        if (isMove) {
            // таймер, управляющий движением змейки
            window.snakeMoveTimerId = setTimeout(
                _ => moveSnake(),
                props.realSpeed
            );
        }
    }

    function moveSnake() {
        let newSnake = [...snakeLive.snake];
        let newFoodList = [...snakeLive.foodList];
        const {cellSize} = props.baseSizes;
        let {dx, dy} = props.deltaXY;
        dx *= cellSize;
        dy *= cellSize;
        let head = {
            x: newSnake[0].x + dx,
            y: newSnake[0].y + dy,
            color: newSnake[1].color
        };
        let isWall = checkWall(head.x, head.y);
        let eaten;

        newFoodList.forEach(e => {
            if (head.x === e.x && head.y === e.y) eaten = e;
        })
        // больше предохранитель, чем необходимость
        if (eaten) {
            props.increaseScore();
            if (props.score >= props.maxScore) {
                props.switchWin();
                props.playSound('win');
            } else {
                newSnake.unshift(head);
                newSnake = newSnake.map(cell => ({
                    ...cell,
                    color: eaten.i,
                }));
                newFoodList = newFoodList.filter(e => !Object.is(e, eaten));
                newFoodList.push(getFood());
                props.playSound('eat');
                setSnakeLive({
                    ...snakeLive,
                    snake: newSnake,
                    foodList: newFoodList,
                });
            }
        } else {
            if (isWall) {
                props.switchFail();
                props.playSound('fail');
                window.navigator?.vibrate(300);
            } else {
                newSnake.unshift(head);
                newSnake.pop();
                setSnakeLive({
                    ...snakeLive,
                    snake: newSnake,
                });
            }
        }
    }

    function checkWall(headX, headY) {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        let {snake, barriers} = snakeLive;
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

    function getFoodList(snakeInitial, barriersInitial) {
        const foodQty = randAB(10, 15);
        const foodList = [];

        const createFood = _ => {
            const newFood = getFood(foodList, snakeInitial, barriersInitial);
            foodList.push(newFood)
        }

        Array.from({length: foodQty}, _ => null)
            .forEach(e => createFood());
        return foodList;
    }

    // формируем квадратик(еду) различного цвета с различным местоположением
    function getFood(foodListInitial, snakeInitial, barriersInitial) {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        let {snake, foodList, barriers} = snakeLive;

        let n = randAB(0, 7); // любой из 8 цветов
        let i = snakeColors[n].i // цвет квадратика
        let j = snakeColors[n].j // цвет рамки квадратика
        let x, y;

        const snakeResult = snakeInitial ? snakeInitial : snake;
        const barriersResult = barriersInitial ? barriersInitial : barriers;
        const foodListResult = foodListInitial ? foodListInitial : foodList;

        const isCorrectCell = (x, y) => (
            // чтобы еда не попала в зону змеи
            !snakeResult.some(e => (x === e.x && y === e.y)) &&
            // чтобы координаты еды не совпали с барьерами
            !barriersResult.flat().some(e => (x === e.x && y === e.y)) &&
            // чтобы координаты еды не совпали(2х квадратиков)
            !foodListResult.some(e => (x === e.x && y === e.y))
        );

        do {
            x = Math.round(randAB(0, activeWidth - cellSize) / cellSize) * cellSize;
            y = Math.round(randAB(0, activeHeight - cellSize) / cellSize) * cellSize;
        } while (!isCorrectCell(x, y))
        return {x, y, i, j};
    }

    function getRandBarrier() {
        const {cellSize} = props.baseSizes;
        // получаем случайную фигуру
        const figureIndex = randAB(0, barriersScheme.length - 1);
        const newFigure = barriersScheme[figureIndex];
        // получаем ее случайную трансформацию
        const transformIndex = randAB(0, newFigure.length - 1);
        return newFigure[transformIndex].map(cell => ({
            x: cell.x * cellSize,
            y: cell.y * cellSize,
        }));
    }

    function getCorrectBarrier(barriers, snake, foodList) {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        // проверка, что все клетки барьера в пределах клеточной зоны
        // и не совпадают со змейкой и с другими барьерами
        const isCorrectBarrierCell = ({x, y}) => (
            x >= 0 && x <= activeWidth - cellSize && y >= 0 && y <= activeHeight - cellSize &&
            !snake.some(cell => (x === cell.x && y === cell.y)) &&
            !barriers.flat().some(cell => (x === cell.x && y === cell.y)) &&
            !foodList.flat().some(cell => (x === cell.x && y === cell.y))
        );
        let testBarrier;
        let newBarrier = getRandBarrier();
        let count = 0;
        let isFail;
        // смещение барьера по вертикали и горизонтали в пределах клеточной зоны
        let dx, dy;
        do {
            dx = Math.round(randAB(-cellSize * 2, activeWidth - cellSize) / cellSize) * cellSize;
            dy = Math.round(randAB(-cellSize * 2, activeHeight - cellSize) / cellSize) * cellSize;
            testBarrier = newBarrier.map(cell => ({x: cell.x + dx, y: cell.y + dy}));
            count++;
            // защита от зависания, места барьерам может и не хватить по идее
            if (count >= 500) {
                isFail = true;
                break;
            }
        } while (!testBarrier.every(cell => isCorrectBarrierCell(cell)));
        return !isFail ? testBarrier : [];
    }

    function getBarriers(snake, foodList) {
        const barrierQty = randAB(3, 10);
        const barriers = [];

        const createBarrier = _ => {
            const newBarrier = getCorrectBarrier(barriers, snake, foodList);
            barriers.push(newBarrier)
        }

        Array.from({length: barrierQty}, _ => null)
            .forEach(e => createBarrier());
        return barriers;
    }


    const {
        grid_styles,
        food_styles,
        barrier_styles,
        snake_styles
    } = getReadyStyles(snakeLive, props.baseSizes);
    const getBox = (className, style, key) => (
        <div
            className={className}
            style={style}
            key={key}>
        </div>);
    return (
        <div className={'board ' + (props.isDarkMode ? 'dark-theme' : 'light-theme')}>
            <div className="grid"
                 style={
                     {
                         width: props.baseSizes.activeWidth,
                         height: props.baseSizes.activeHeight
                     }}>
                {grid_styles.map((cell, i) =>
                    getBox('cell', cell, i)
                )}
            </div>
            <div className="barrier">
                {barrier_styles.map((box, i) =>
                    getBox('barrier-chunk', box, i)
                )}
            </div>
            <div className="foodList">
                {food_styles.map((box, i) =>
                    getBox('food', box, i)
                )}
            </div>
            <div className="snake">
                {snake_styles.map((box, i) =>
                    getBox('snake-chunk', box, i)
                )}
            </div>
        </div>
    );
}