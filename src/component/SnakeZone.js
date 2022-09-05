import React, {Component} from 'react';
import randAB from "../service/utils";
import {snakeColors} from '../service/colors';
import barriersScheme from '../service/barriersScheme';

export default class SnakeZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // горизонтальная скорость
            dx: null,
            // вертикальная скорость
            dy: null,
            snake_color: '',
            snake: [],
            foodList: [],
            barriers: []
        };
        this.screenRef = React.createRef();
    }

    componentDidMount = () => {
        // предварительно загружаем звуки
        this.calculateCellSize();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.snakeCourse !== this.props.snakeCourse) {
            this.changeCourse(this.props.snakeCourse);
        }

        const startSnake = _ => {
            this.timerIn = setTimeout(this.move_snake, this.getSpeed());
        }
        if (prevProps.activeStatus !== this.props.activeStatus) {
            if (this.props.activeStatus === 'init') {
                this.init();
            } else if (this.props.activeStatus === 'restart') {
                this.init();
                // чтобы окно настроек каждый раз не отображать
                startSnake();
            } else if (this.props.activeStatus === 'snakeMove') {
                startSnake();
            } else {
                clearTimeout(this.timerIn);
            }
        }
    }

    // голая инициализация бех запуска змейки
    init = _ => {
        const snake = [
            {x: this.cellSize * 2, y: this.cellSize * 10},
            {x: this.cellSize, y: this.cellSize * 10},
            {x: 0, y: this.cellSize * 10},
        ];
        const barriers = this.getBarriers(snake);
        const foodList = this.getFoodList(snake, barriers);
        this.setState({
            dx: this.cellSize,
            dy: 0,
            snake_color: 'grey',
            snake,
            barriers,
            foodList
        });
    }

    // исходя из ширины экрана рассчитываем размер клеточки доски
    calculateCellSize = () => {
        const body = document.querySelector('html');
        const device = {
            width: body.offsetWidth,
            height: body.offsetHeight
        }
        this.isMobile = device.width < 500;

        const heightPart = this.isMobile ? 0.75 : 0.85;
        const widthPart = this.isMobile ? 8.5 / 20 : 9.5 / 16;

        const scale = 1;
        let cellBase = device.height < 900 ? 34 : 31;
        cellBase = this.isMobile ? 32 : cellBase;
        this.cellSize = Math.round(cellBase * scale * device.height / 960);

        this.activeHeight = Math.round(device.height * heightPart / this.cellSize) * this.cellSize;
        this.activeWidth = Math.round(this.activeHeight * widthPart / this.cellSize) * this.cellSize;
        this.cellQuantity = Math.round(this.activeWidth * this.activeHeight / (this.cellSize * this.cellSize));

        this.forceUpdate();
    }

    getRandBarrier = _ => {
        // получаем случайную фигуру
        const figureIndex = randAB(0, barriersScheme.length - 1);
        const newFigure = barriersScheme[figureIndex];
        // получаем ее случайную трансформацию
        const transformIndex = randAB(0, newFigure.length - 1);
        return newFigure[transformIndex].map(cell => ({
            x: cell.x * this.cellSize,
            y: cell.y * this.cellSize,
        }));
    }

    getCorrectBarrier = (barriers, snake) => {
        // проверка, что все клетки барьера в пределах клеточной зоны
        // и не совпадают со змейкой и с другими барьерами
        const isCorrectBarrierCell = ({x, y}) => (
            x >= 0 && x <= this.activeWidth - this.cellSize && y >= 0 && y <= this.activeHeight - this.cellSize &&
            !snake.some(cell => (x === cell.x && y === cell.y)) &&
            !barriers.flat().some(cell => (x === cell.x && y === cell.y))
        );
        let testBarrier;
        let newBarrier = this.getRandBarrier();
        let count = 0;
        let isFail;
        // смещение барьера по вертикали и горизонтали в пределах клеточной зоны
        let dx, dy;
        do {
            dx = Math.round(randAB(-this.cellSize * 2, this.activeWidth - this.cellSize) / this.cellSize) * this.cellSize;
            dy = Math.round(randAB(-this.cellSize * 2, this.activeHeight - this.cellSize) / this.cellSize) * this.cellSize;
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

    getBarriers = (snake) => {
        const barrierQty = randAB(4, 10);
        const barriers = [];

        const createBarrier = _ => {
            const newBarrier = this.getCorrectBarrier(barriers, snake);
            barriers.push(newBarrier)
        }

        Array.from({length: barrierQty}, _ => null)
            .forEach(e => createBarrier());
        return barriers;
    }

    // формируем квадратик(еду) различного цвета с различным местоположением
    getFood = (foodList, snake, barriers) => {
        let n = randAB(0, 7); // любой из 8 цветов
        let i = snakeColors[n].i // цвет квадратика
        let j = snakeColors[n].j // цвет рамки квадратика
        let x, y;
        const snakeResult = this.state.snake.length ? this.state.snake : snake;
        const barriersResult = this.state.barriers.length ? this.state.barriers.flat() : barriers.flat();
        const foodListResult = this.state.foodList.length ? this.state.foodList : foodList;

        const isCorrectCell = (x, y) => (
            // чтобы еда не попала в зону змеи
            !snakeResult.some(e => (x === e.x && y === e.y)) &&
            // чтобы координаты еды не совпали с барьерами
            !barriersResult.some(e => (x === e.x && y === e.y)) &&
            // чтобы координаты еды не совпали(2х квадратиков)
            !foodListResult.some(e => (x === e.x && y === e.y))
        );

        do {
            x = Math.round(randAB(0, this.activeWidth - this.cellSize) / this.cellSize) * this.cellSize;
            y = Math.round(randAB(0, this.activeHeight - this.cellSize) / this.cellSize) * this.cellSize;
        } while (!isCorrectCell(x, y))
        return {x, y, i, j};
    }

    getFoodList = (snake, barriers) => {
        const foodQty = randAB(8, 12);
        const foodList = [];

        const createFood = _ => {
            const newFood = this.getFood(foodList, snake, barriers);
            foodList.push(newFood)
        }

        Array.from({length: foodQty}, _ => null)
            .forEach(e => createFood());
        return foodList;
    }

    move_snake = () => {
        const props = this.props;
        let {snake, dx, dy, foodList, snake_color} = this.state;
        let head = {x: snake[0].x + dx, y: snake[0].y + dy};
        let eaten = null;
        let isWall = this.check_wall(head.x, head.y);

        foodList.forEach(e => {
            if (head.x === e.x && head.y === e.y) eaten = e;
        })
        clearTimeout(this.timerIn);
        if (eaten) {
            this.props.increaseScore();
            if (this.props.score === this.props.maxScore) {
                this.props.switchWin();
                props.playSound('win');
            } else {
                snake.unshift(head);
                foodList = foodList.filter(e => !Object.is(e, eaten));
                foodList.push(this.getFood());
                snake_color = eaten.i;
                this.setState({snake, foodList, snake_color});
                props.playSound('eat');
                this.timerIn = setTimeout(this.move_snake, this.getSpeed());
            }
        } else {
            if (isWall) {
                this.props.switchFail();
                props.playSound('fail');
                window.navigator?.vibrate(300);
            } else {
                snake.unshift(head);
                snake.pop();
                this.setState({snake})
                this.timerIn = setTimeout(this.move_snake, this.getSpeed());
            }
        }
    }

    check_wall = (headX, headY) => {
        let {snake, barriers} = this.state;
        // проверяем, не ударилась ли змея о саму себя
        for (let i = 3; i < snake.length; i++) {
            if (headX === snake[i].x && headY === snake[i].y) {
                return true;
            }
        }
        // проверяем, не ударилась ли змея о стену
        if (headX < 0 || headX > this.activeWidth - this.cellSize ||
            headY < 0 || headY > this.activeHeight - this.cellSize) {
            return true
        }
        // проверяем, не ударилась ли змея о барьеры
        if (barriers.flat().some(cell => (headX === cell.x && headY === cell.y))) {
            return true
        }
        return false;
    }

    changeCourse = (course) => {
        let {dx, dy} = this.state;
        if (course === 'left' && dx === 0) {
            dx = -this.cellSize;
            dy = 0
        } else if (course === 'left' && dx === this.cellSize) {
            dx = 0;
            dy = -this.cellSize
        }

        if (course === 'right' && dx === 0) {
            dx = this.cellSize;
            dy = 0
        } else if (course === 'right' && dx === -this.cellSize) {
            dx = 0;
            dy = -this.cellSize
        }

        if (course === 'up' && dy === 0) {
            dx = 0;
            dy = -this.cellSize
        } else if (course === 'up' && dy === this.cellSize) {
            dx = -this.cellSize;
            dy = 0
        }

        if (course === 'down' && dy === 0) {
            dx = 0;
            dy = this.cellSize
        } else if (course === 'down' && dy === -this.cellSize) {
            dx = -this.cellSize;
            dy = 0
        }
        if (dx !== this.state.dx && dy !== this.state.dy) this.setState({dx, dy});
    }

    getSpeed = _ => {
        const speedNum = this.props.speedNum;
        let speedResult;
        if (speedNum === 1) speedResult = 280;
        if (speedNum === 2) speedResult = 250;
        if (speedNum === 3) speedResult = 200;
        if (speedNum === 4) speedResult = 150;
        return speedResult;
    }

    render() {
        const state = this.state;
        const {
            barriers,
            foodList,
            snake,
            snake_color,
        } = this.state;
        const scale = 1;
        const grid = Array.from({length: this.cellQuantity}).fill(null);

        // масштабирование стилей
        const box = {width: this.cellSize * scale, height: this.cellSize * scale};
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
            backgroundColor: !i ? 'black' : snake_color,
            zIndex: !i ? 1 : 0,
            borderWidth: 0
        }));

        return (
            <div className={'snake-zone ' +
                (this.props.isDarkMode ? 'dark-theme' : 'light-theme') +
                (this.props.isRoundCells ? ' round-mode' : '')}>
                <div className="grid"
                     style={{width: this.activeWidth, height: this.activeHeight}}>
                    {grid_styles.map((cell, i) =>
                        <div
                            className="cell"
                            style={cell}
                            key={i}>
                        </div>
                    )}
                </div>
                <div className="barrier">
                    {barrier_styles.map((box, i) =>
                        <div
                            className="box"
                            style={box}
                            key={i}>
                        </div>
                    )}
                </div>
                <div className="foodList">
                    {food_styles.map((box, i) =>
                        <div
                            className="box"
                            style={box}
                            key={i}>
                        </div>
                    )}
                </div>
                <div className="snake">
                    {snake_styles.map((box, i) =>
                        <div
                            className="box"
                            style={box}
                            key={i}>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}