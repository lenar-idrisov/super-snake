import {useState, useEffect} from 'react';
import {getKeydownKey} from "../service/helpers";
import {SpeedDXDY} from "../service/customTypes";

export default () => {
    // направление хода змеи
    const [dir, setDirection] = useState('');
    // дельта, прибавляемая к координатам змеи при ее хождении,
    // (скорость змеи по оси x и y)
    const [speedDXDY, setSpeedDXDY] = useState<SpeedDXDY|null>(null);

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        }
    });

    const getCorrectedDir = (newDirection: string) => {
        let resultCourse = newDirection;
        // змея не может сразу в противоположном направлении начать ходить
        // исправляем на промежуточный курс (вверх или вправо)
        if ((dir === 'right' && newDirection === 'left') ||
            (dir === 'left' && newDirection === 'right')) {
            resultCourse = 'up';
        } else if ((dir === 'up' && newDirection === 'down') ||
            (dir === 'down' && newDirection === 'up')) {
            resultCourse = 'right';
        }
        return resultCourse;
    }

    const changeDirection = (newDirection: string) => {
        const correctDir = getCorrectedDir(newDirection);
        if (newDirection !== dir) {
            // нужно, чтобы змея не успела сделать шаг в старом направлении
            clearTimeout((window as any).snakeMoveTimerId);
            changeSpeedDXDY(correctDir);
            setDirection(correctDir);
        }
    }

    const keydownHandler = (event: KeyboardEvent) => {
        const newDir = getKeydownKey(event);
        if (newDir !== null && newDir !== dir) {
            changeDirection(newDir);
        }
    }

    const changeSpeedDXDY = (newDir: string) => {
        let newDX, newDY;

        if (newDir === 'left') {
            newDX = -1;
            newDY = 0
        } else if (newDir === 'right') {
            newDX = 1;
            newDY = 0
        } else if (newDir === 'up') {
            newDX = 0;
            newDY = -1
        } else if (newDir === 'down') {
            newDX = 0;
            newDY = 1
        } else {
            return;
        }
        setSpeedDXDY({
            dx: newDX,
            dy: newDY
        });
    }

    return {
        dir,
        speedDXDY,
        changeDirection
    }
}