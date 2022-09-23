import {useState, useEffect, useRef} from 'react';
import randAB from "../service/utils";
import {snakeColors} from '../service/colors';
import barriersScheme from '../service/barriersScheme';

export default function SnakeZone(props) {
    // разеры клеточной зоны, где ходит змея
    // (ширина высота зоны, кол-во клеток, размер клетки)
    const baseSizesRef = useRef();
    // таймер, управляющий движением змейки
    const timerRef = useRef();
    const deltaXY = useRef();

    // горизонтальная и вертикальная скорости
    const [snakeColor, setSnakeColor] = useState('');
    const [snakeObjects, setSnakeObjects] = useState({
            snake: [],
            foodList: [],
            barriers: []
        }
    );

    useEffect(_ => {
        baseSizesRef.current = getCalculatedSizes();
    }, []);

    useEffect(_ => {
        if (!props.snakeCourse) return;
        changeCourse(props.snakeCourse);
    }, [props.snakeCourse]);

    useEffect(_ => {
        if (!props.activeStatus) return;
        if (props.activeStatus === 'init' || props.activeStatus === 'restart') {
            init();
        } else if (props.activeStatus === 'snakeMove') {
            switchSnakeMoving(true);
        } else {
            switchSnakeMoving(false);
        }
    }, [props.activeStatus])

    // исходя из ширины экрана рассчитываем размер клеточки зоны
    function getCalculatedSizes() {
        const body = document.querySelector('html');
        const device = {
            width: body.offsetWidth,
            height: body.offsetHeight
        }
        const scale = 1;
        const isMobile = device.width < 500;
        const cellBase = isMobile ? 26 : (device.height < 900 ? 34 : 31);

        const heightPart = isMobile ? 0.75 : 0.88;
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

    // голая инициализация бех запуска змейки
    function init() {
        const cellSize = baseSizesRef.current.cellSize;
        const snake = [
            {x: cellSize * 2, y: cellSize * 10},
            {x: cellSize, y: cellSize * 10},
            {x: 0, y: cellSize * 10},
        ];
        const barriers = getBarriers(snake);
        const foodList = getFoodList(snake, barriers);
        setSnakeColor('grey');
        setSnakeObjects({
            snake,
            barriers: [], // props.isEasyMode ? [] : barriers,
            foodList,
        })
    }

    function switchSnakeMoving(isMove) {
        if (isMove) {
            timerRef.current = setTimeout(move_snake, getSpeed());
        } else {
            clearTimeout(timerRef.current);
        }
    }

    function getRandBarrier() {
        const cellSize = baseSizesRef.current.cellSize;
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

    function getCorrectBarrier(barriers, snake) {
        const {cellSize, activeWidth, activeHeight} = baseSizesRef.current;
        // проверка, что все клетки барьера в пределах клеточной зоны
        // и не совпадают со змейкой и с другими барьерами
        const isCorrectBarrierCell = ({x, y}) => (
            x >= 0 && x <= activeWidth - cellSize && y >= 0 && y <= activeHeight - cellSize &&
            !snake.some(cell => (x === cell.x && y === cell.y)) &&
            !barriers.flat().some(cell => (x === cell.x && y === cell.y))
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

    function getBarriers(snake) {
        const barrierQty = randAB(3, 7);
        const barriers = [];

        const createBarrier = _ => {
            const newBarrier = getCorrectBarrier(barriers, snake);
            barriers.push(newBarrier)
        }

        Array.from({length: barrierQty}, _ => null)
            .forEach(e => createBarrier());
        return barriers;
    }

    // формируем квадратик(еду) различного цвета с различным местоположением
    function getFood(foodListInitial, snakeInitial, barriersInitial) {
        const {cellSize, activeWidth, activeHeight} = baseSizesRef.current;
        let {snake, foodList, barriers} = snakeObjects;

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

    function getFoodList(snakeInitial, barriersInitial) {
        const foodQty = randAB(8, 12);
        const foodList = [];

        const createFood = _ => {
            const newFood = getFood(foodList, snakeInitial, barriersInitial);
            foodList.push(newFood)
        }

        Array.from({length: foodQty}, _ => null)
            .forEach(e => createFood());
        return foodList;
    }

    function move_snake() {
        let {snake, foodList} = snakeObjects;
        const {dx, dy} = deltaXY.current;
        let head = {x: snake[0].x + dx, y: snake[0].y + dy};
        let eaten = null;
        let isWall = check_wall(head.x, head.y);

        foodList.forEach(e => {
            if (head.x === e.x && head.y === e.y) eaten = e;
        })
        // больше предохранитель, чем необходимость
        switchSnakeMoving(false);
        if (eaten) {
            props.increaseScore();
            if (props.score === props.maxScore) {
                props.switchWin();
                props.playSound('win');
            } else {
                snake.unshift(head);
                foodList = foodList.filter(e => !Object.is(e, eaten));
                foodList.push(getFood());
                setSnakeColor(eaten.i);
                setSnakeObjects({
                    ...snakeObjects,
                    snake,
                    foodList,
                });
                props.playSound('eat');
                switchSnakeMoving(true);
            }
        } else {
            if (isWall) {
                props.switchFail();
                props.playSound('fail');
                //window.navigator?.vibrate(300);
            } else {
                snake.unshift(head);
                snake.pop();
                setSnakeObjects({
                    ...snakeObjects,
                    snake,
                });
                switchSnakeMoving(true);
            }
        }
    }

    function check_wall(headX, headY) {
        const {cellSize, activeWidth, activeHeight} = baseSizesRef.current;
        let {snake, barriers} = snakeObjects;
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

    function changeCourse(course) {
        const cellSize = baseSizesRef.current.cellSize;
        let newDX, newDY;

        if (course === 'left') {
            newDX = -cellSize;
            newDY = 0
        } else if (course === 'right') {
            newDX = cellSize;
            newDY = 0
        } else if (course === 'up') {
            newDX = 0;
            newDY = -cellSize
        } else if (course === 'down') {
            newDX = 0;
            newDY = cellSize
        }
        deltaXY.current = {
            dx: newDX,
            dy: newDY
        }
    }

    function getSpeed() {
        const speedNum = props.speedNum;
        let speedResult;
        if (speedNum === 1) speedResult = 290;
        if (speedNum === 2) speedResult = 250;
        if (speedNum === 3) speedResult = 200;
        if (speedNum === 4) speedResult = 150;
        return speedResult;
    }

    function getReadyStyles() {
        const scale = 1;
        const {cellSize, cellQuantity} = baseSizesRef.current;
        const {snake, barriers, foodList} = snakeObjects;
        const grid = Array.from({length: cellQuantity}).fill(null);

        // масштабирование стилей
        const box = {width: cellSize * scale, height: cellSize * scale};
        const grid_styles = grid.map(e => box);
        const food_styles = foodList.map((e, i) => ({
            ...box,
            top: e.y * scale,
            left: e.x * scale,
            backgroundColor: e.i,
            borderColor: e.j
        }));

        const barrier_styles = barriers.flat().map((e, i) => ({
            ...box,
            top: e.y * scale,
            left: e.x * scale,
            backgroundColor: '#4f4e57',
            borderWidth: 0
        }));

        const snake_styles = snake.map((e, i) => ({
            ...box,
            top: e.y * scale,
            left: e.x * scale,
            // у головы змеи особые стили
            backgroundColor: !i ? 'black' : snakeColor,
            zIndex: !i ? 1 : 0,
            borderWidth: 0
        }));

        return {
            grid_styles,
            food_styles,
            barrier_styles,
            snake_styles
        }
    }

    if (!baseSizesRef.current) return null;

    const {
        grid_styles,
        food_styles,
        barrier_styles,
        snake_styles
    } = getReadyStyles();
    const getBox = (className, style, key) => (
        <div
            className={className}
            style={style}
            key={key}>
        </div>);
    return (
        <div className={'snake-zone ' +
            (props.isDarkMode ? 'dark-theme' : 'light-theme') +
            (props.isRoundCells ? ' round-mode' : '')}>
            <div className="grid"
                 style={{width: baseSizesRef.current.activeWidth, height: baseSizesRef.current.activeHeight}}>
                {grid_styles.map((cell, i) =>
                    getBox('cell', cell, i)
                )}
            </div>
            <div className="barrier">
                {barrier_styles.map((box, i) =>
                    getBox('box', box, i)
                )}
            </div>
            <div className="foodList">
                {food_styles.map((box, i) =>
                    getBox('box', box, i)
                )}
            </div>
            <div className="snake">
                {snake_styles.map((box, i) =>
                    getBox('box', box, i)
                )}
            </div>
        </div>
    );
}