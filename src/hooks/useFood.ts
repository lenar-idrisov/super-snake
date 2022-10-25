import {randAB} from "../service/utils";
import {snakeColors} from "../service/colors";
import {
    FoodOne,
    BaseSizes,
    SnakeSlice,
    BarrierUnit,
} from "../types/functionTypes";
import {useActions, useTypedSelector} from "./baseHooks";
import {useEffect} from "react";


export default function useFood(baseSizes: BaseSizes) {
    const {snake, foodList, barriers} = useTypedSelector(state => state.snake);
    const {updateFood} = useActions();


    useEffect(() => {
        const existFoodList = foodList.filter(food =>
            !(food.x === snake[0].x && food.y === snake[0].y));
        updateFood([
            ...existFoodList,
            getNewFood()
        ]);
    }, [snake.length]);


    function getFoodList(snakeInitial: SnakeSlice[], barriersInitial?: BarrierUnit[]) {
        const foodQty = randAB(10, 15);
        const foodList = [] as FoodOne[];

        const createFood = () => {
            const newFood = getNewFood(foodList, snakeInitial, barriersInitial);
            foodList.push(newFood)
        }

        Array.from({length: foodQty}, () => null)
            .forEach(e => createFood());
        return foodList;
    }

    // формируем квадратик(еду) различного цвета с различным местоположением
    function getNewFood(
        existFoodList?: FoodOne[],
        snakeInitial?: SnakeSlice[],
        barriersInitial?: BarrierUnit[]
    ): FoodOne {
        const {cellSize, activeWidth, activeHeight} = baseSizes;

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

    return {
        foodList,
        getFoodList
    };
}