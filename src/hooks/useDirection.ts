import {useState, useEffect} from 'react';
import {getKeydownKey} from "../service/helpers";
import {SpeedXY} from "../types/functionTypes";

enum Dirs {
    Right= 'right',
    Left = 'left',
    Up = 'up',
    Down = 'down'
}


export default () => {
    // направление хода змеи
    const [dir, setDirection] = useState('');
    // дельта, прибавляемая к координатам змеи при ее хождении,
    // (скорость змеи по оси x и y)
    const [speedXY, setSpeedXY] = useState<SpeedXY|null>(null);

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
        if ((dir === Dirs.Right && newDirection === Dirs.Left) ||
            (dir === Dirs.Left && newDirection === Dirs.Right)) {
            resultCourse = Dirs.Up;
        } else if ((dir === Dirs.Up && newDirection === Dirs.Down) ||
            (dir === Dirs.Down && newDirection === Dirs.Up)) {
            resultCourse = Dirs.Right;
        }
        return resultCourse;
    }

    const changeDirection = (newDirection: string) => {
        const correctDir = getCorrectedDir(newDirection);
        if (newDirection !== dir) {
            // нужно, чтобы змея не успела сделать шаг в старом направлении
            clearTimeout((window as any).snakeMoveTimerId);
            changeSpeedXY(correctDir);
            setDirection(correctDir);
        }
    }

    const keydownHandler = (event: KeyboardEvent) => {
        const newDir = getKeydownKey(event);
        if (newDir !== null && newDir !== dir) {
            changeDirection(newDir);
        }
    }

    const changeSpeedXY = (newDir: string) => {
        let newDX, newDY;

        if (newDir === Dirs.Left) {
            newDX = -1;
            newDY = 0
        } else if (newDir === Dirs.Right) {
            newDX = 1;
            newDY = 0
        } else if (newDir === Dirs.Up) {
            newDX = 0;
            newDY = -1
        } else if (newDir === Dirs.Down) {
            newDX = 0;
            newDY = 1
        } else {
            return;
        }
        setSpeedXY({
            dx: newDX,
            dy: newDY
        });
    }

    return {
        speedXY,
        changeDirection
    }
}