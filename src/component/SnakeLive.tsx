import {useState, useEffect, useRef} from 'react';
import randAB from "../service/utils";
import {snakeColors} from "../service/colors";
import barriersScheme from "../service/barriersScheme";
import {getReadyStyles} from "../service/helpers";
import {
    SnakeLiveProps,
    SnakeLiveState,
    SnakeOne,
    FoodOne,
    BarrierUnit,
    Point,
    SpeedDXDY
} from "../service/customTypes";

export default function SnakeLive(props: SnakeLiveProps) {
    const prevDirRef = useRef<string>();
    // горизонтальная и вертикальная скорости
    const [snakeLiveState, setSnakeLiveState] = useState<SnakeLiveState>({
        snake: [],
        foodList: [],
        barriers: []
    });

    useEffect(() => {
        if (['init', 'restart'].includes(props.gameStatus)) {
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

            setSnakeLiveState({
                foodList,
                barriers,
                snake
            });
            if (props.gameStatus === 'restart') {
                // запускаем, не показывая окно настроек
                props.changeStatus('move');
            }
        } else if (['pause', 'fail', 'win', 'settings'].includes(props.gameStatus)) {
            setSnakeMove(false);
        } else if (props.gameStatus === 'move') {
            setSnakeMove(true);
        }
    }, [props.gameStatus]);

    useEffect(() => {
        // если ниче не поменялось - просто выходим
        if ((props.isHardMode && snakeLiveState.barriers.length) ||
            (!props.isHardMode && !snakeLiveState.barriers.length)) return;
        setSnakeLiveState({
            ...snakeLiveState,
            barriers: props.isHardMode ?
                getBarriers(snakeLiveState.snake, snakeLiveState.foodList) : []
        });
    }, [props.isHardMode])


    useEffect(() => {
        if (props.gameStatus !== 'move') return;
        if (!prevDirRef.current) prevDirRef.current = props.dir;
        if (prevDirRef.current !== props.dir) {
            prevDirRef.current = props.dir;
            // запускает змею после смены курса
            moveSnake();
        } else {
            // двигает змею вперед
            setSnakeMove(true);
        }
        return () => setSnakeMove(false);
    }, [snakeLiveState, props.dir])

    function setSnakeMove(isMove: boolean) {
        clearTimeout((window as any).snakeMoveTimerId);
        if (isMove) {
            // таймер, управляющий движением змейки
            (window as any).snakeMoveTimerId = setTimeout(
                () => moveSnake(),
                props.realSpeed
            );
        }
    }

    function moveSnake() {
        let newSnake = [...snakeLiveState.snake];
        let newFoodList = [...snakeLiveState.foodList];
        const {cellSize} = props.baseSizes;
        let {dx, dy} = props.speedDXDY as SpeedDXDY;
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
                setSnakeLiveState({
                    ...snakeLiveState,
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
                setSnakeLiveState({
                    ...snakeLiveState,
                    snake: newSnake,
                });
            }
        }
    }

    /**
     @param {number} headX координата x головы змейки
     @param {number} headY координата y головы змейки
     * */
    function checkWall(headX: number, headY: number) {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        let {snake, barriers} = snakeLiveState;
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

    function getFoodList(snakeInitial: SnakeOne[], barriersInitial: BarrierUnit[]) {
        const foodQty = randAB(10, 15);
        const foodList = [] as FoodOne[];

        const createFood = () => {
            const newFood = getFood(foodList, snakeInitial, barriersInitial);
            foodList.push(newFood)
        }

        Array.from({length: foodQty}, () => null)
            .forEach(e => createFood());
        return foodList;
    }

    // формируем квадратик(еду) различного цвета с различным местоположением
    function getFood(
        existFoodList?: FoodOne[],
        snakeInitial?: SnakeOne[],
        barriersInitial?: BarrierUnit[]
    ): FoodOne {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        let {snake, foodList, barriers} = snakeLiveState;

        let n = randAB(0, 7); // любой из 8 цветов
        let i = snakeColors[n].i // цвет квадратика
        let j = snakeColors[n].j // цвет рамки квадратика
        let x, y;

        const snakeResult = snakeInitial || snake;
        const barriersResult = barriersInitial || barriers;
        const foodListResult = existFoodList || foodList;

        const isCorrectCell = (x: number, y: number) => (
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

    function getRandBarrier(): BarrierUnit {
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

    function getCorrectBarrier(
        existBarriers: BarrierUnit[],
        snakeInitial: SnakeOne[],
        foodListInitial: FoodOne[]
    ): BarrierUnit {
        const {cellSize, activeWidth, activeHeight} = props.baseSizes;
        // проверка, что все клетки барьера в пределах клеточной зоны
        // и не совпадают со змейкой и с другими барьерами
        const isCorrectBarrierCell = ({x, y}: Point) => (
            x >= 0 && x <= activeWidth - cellSize && y >= 0 && y <= activeHeight - cellSize &&
            !snakeInitial.some(cell => (x === cell.x && y === cell.y)) &&
            !existBarriers.flat().some(cell => (x === cell.x && y === cell.y)) &&
            !foodListInitial.flat().some(cell => (x === cell.x && y === cell.y))
        );
        let testBarrier;
        let newBarrier = getRandBarrier();
        let count = 0;
        let isFail;
        // смещение барьера по вертикали и горизонтали в пределах клеточной зоны
        let dx: number;
        let dy: number;
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

    function getBarriers(
        snakeInitial: SnakeOne[],
        foodListInitial: FoodOne[]): BarrierUnit[] {
        const barrierQty = randAB(3, 10);
        const barriers = [] as BarrierUnit[];

        const createBarrier = () => {
            const newBarrier = getCorrectBarrier(barriers, snakeInitial, foodListInitial);
            barriers.push(newBarrier)
        }

        Array.from({length: barrierQty}, () => null)
            .forEach(() => createBarrier());
        return barriers;
    }


    const {
        grid_styles,
        food_styles,
        barrier_styles,
        snake_styles
    } = getReadyStyles(snakeLiveState, props.baseSizes);
    const getBox = (className: string, style: object, key: number) => (
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