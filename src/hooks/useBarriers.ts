import {useEffect} from 'react';
import {randAB} from "../service/utils";
import barriersScheme from "../service/barriersScheme";
import {
    BarrierUnit,
    Point,
    BaseSizes, SnakeSlice, FoodOne,
} from "../types/functionTypes";
import {useActions, useTypedSelector} from "./baseHooks";


export default function useBarriers(baseSizes: BaseSizes) {
    const {isHardMode} = useTypedSelector(state => state.flags);
    const {snake, foodList, barriers} = useTypedSelector(state => state.snake);
    const {updateBarriers} = useActions();

    useEffect(() => {
        updateBarriers(getBarriers());
    }, [isHardMode]);


    function getRandBarrier(): BarrierUnit {
        const {cellSize} = baseSizes;
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
        snakeInitial: SnakeSlice[],
        foodListInitial: FoodOne[]
    ): BarrierUnit {
        const {cellSize, activeWidth, activeHeight} = baseSizes;
        // проверка, что все клетки барьера в пределах клеточной зоны
        // и не совпадают со змейкой и с другими барьерами
        const isCorrectBarrierCell = ({x, y}: Point) => (
            x >= 0 && x <= activeWidth - cellSize && y >= 0 && y <= activeHeight - cellSize &&
            !snakeInitial.some(cell => (x === cell.x && y === cell.y)) &&
            !foodListInitial.flat().some(cell => (x === cell.x && y === cell.y)) &&
            !existBarriers.flat().some(cell => (x === cell.x && y === cell.y))
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
        snakeInitial?: SnakeSlice[],
        foodListInitial?: FoodOne[]): BarrierUnit[] {
        const barrierQty = randAB(3, 10);
        const existBarriers = [] as BarrierUnit[];

        const snakeResult = snakeInitial || snake;
        const foodListResult = foodListInitial || foodList;

        const createBarrier = () => {
            const newBarrier = getCorrectBarrier(existBarriers, snakeResult, foodListResult);
            existBarriers.push(newBarrier)
        }

        Array.from({length: barrierQty}, () => null)
            .forEach(() => createBarrier());
        return (isHardMode ? existBarriers : []);
    }

    return {
        barriers,
        getBarriers
    }
}