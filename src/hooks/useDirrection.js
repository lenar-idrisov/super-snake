import {useState, useEffect} from 'react';

export default _ => {
    // направление хода змеи
    const [dir, setDirection] = useState(null);
    // дельта, прибавляемая к координатам змеи при ее хождении,
    // (скорость змеи по оси x и y)
    const [deltaXY, setDeltaXY] = useState(null);

    useEffect(_ => {
        document.addEventListener('keydown', keydownHandler);
        return _ => {
            document.removeEventListener('keydown', keydownHandler);
        }
    });

    const getCorrectedDir = (newDirection) => {
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

    const changeDirection = newDirection => {
        const correctDir = getCorrectedDir(newDirection);
        changeDeltaXY(correctDir);
        setDirection(correctDir);
    }

    const keydownHandler = (event) => {
        let dir;
        if (event.code === 'ArrowUp') {
            dir = 'up';
        } else if (event.code === 'ArrowDown') {
            dir = 'down';
        } else if (event.code === 'ArrowRight') {
            dir = 'right';
        } else if (event.code === 'ArrowLeft') {
            dir = 'left';
        }
        changeDirection(dir);
    }

    const changeDeltaXY = (newDir) => {
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
        setDeltaXY({
            dx: newDX,
            dy: newDY
        });
    }

    return {
        deltaXY,
        changeDirection
    }
}