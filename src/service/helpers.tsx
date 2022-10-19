import {
    Point,
    BaseSizes,
    FoodOne,
    SnakeLiveState,
    SnakeSlice,
    BoxStyles
} from "../types/functionTypes";

export const getKeydownKey = (event: KeyboardEvent) => {
    // учитываем только клавиши вверх/вниз/влево/вправо
    if ([
        'ArrowUp', 'ArrowDown',
        'ArrowRight', 'ArrowLeft'
    ].includes(event.code)) {
        return event.code.replace('Arrow', '').toLowerCase();
    } else {
        return null;
    }
}

export const getReadyStyles = (snakeLive: SnakeLiveState, baseSizes: BaseSizes) => {
    // масштабирование стилей
    let {snake, barriers, foodList} = snakeLive;
    const {cellSize, cellQuantity} = baseSizes;
    const grid = Array.from({length: cellQuantity}).fill(null);
    const box = {width: cellSize, height: cellSize};
    const getPosition = (e: SnakeSlice| FoodOne | Point): BoxStyles => ({
        ...box,
        top: e.y,
        left: e.x,
    });

    const grid_styles = grid.map(() => box);
    const food_styles = foodList.map((e, i) => ({
        ...getPosition(e),
        backgroundColor: e.i,
        borderColor: e.j
    }));

    const barrier_styles = barriers.flat().map((e, i) => ({
        ...getPosition(e),
    }));

    const snake_styles = snake.map((e, i) => ({
        ...getPosition(e),
        // у головы змеи особые стили
        backgroundColor: !i ? 'black' : e.color,
    }));

    return {
        grid_styles,
        food_styles,
        barrier_styles,
        snake_styles
    }
}