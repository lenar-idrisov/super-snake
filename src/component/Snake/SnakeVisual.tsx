import './snakeVisual.css';
import {
    BarrierUnit,
    BaseSizes,
    BoxStyles,
    FoodOne,
    getReadyStylesParams,
    Point,
    SnakeSlice
} from "../../types/functionTypes";
import {useTypedSelector} from "../../hooks/baseHooks";
import {SnakeVisualProps} from "../../types/propsTypes";

export default function SnakeVisual({baseSizes}: {baseSizes: BaseSizes}) {
    const {isDarkMode} = useTypedSelector(state => state.flags);
    const {snake, foodList, barriers} = useTypedSelector(state => state.snake);

    const getReadyStyles = (data: getReadyStylesParams, baseSizes: BaseSizes) => {
        // масштабирование стилей
        let {snake, barriers, foodList} = data;
        const {cellSize, cellQuantity} = baseSizes;
        const grid = Array.from({length: cellQuantity}).fill(null);
        const box = {width: cellSize, height: cellSize};
        const getPosition = (e: SnakeSlice | FoodOne | Point): BoxStyles => ({
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

    const {
        grid_styles,
        food_styles,
        barrier_styles,
        snake_styles
    } = getReadyStyles({snake, foodList, barriers}, baseSizes);
    const getBox = (className: string, style: object, key: number) => (
        <div
            className={className}
            style={style}
            key={key}>
        </div>);
    return (
        <div className={'snakeVisual ' + (isDarkMode ? 'dark-theme' : 'light-theme')}>
            <div className="grid"
                 style={
                     {
                         width: baseSizes.activeWidth,
                         height: baseSizes.activeHeight
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