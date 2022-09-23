import {useState, useEffect} from 'react';

export default newCourse => {
    const [snakeCourse, setSnakeCourse] = useState(newCourse);

    useEffect(_ => {
        document.addEventListener('keydown', keydownHandler);
        return _ => {
            document.removeEventListener('keydown', keydownHandler);
        }
    }, []);

    const getCorrectedCourse = (newCourse) => {
        let resultCourse = newCourse;
        // змея не может сразу в противоположном направлении начать ходить
        // исправляем на промежуточный курс (вверх или вправо)
        if ((snakeCourse === 'right' && newCourse === 'left') ||
            (snakeCourse === 'left' && newCourse === 'right')) {
            resultCourse = 'up';
        } else if ((snakeCourse === 'up' && newCourse === 'down') ||
            (snakeCourse === 'down' && newCourse === 'up')) {
            resultCourse = 'right';
        }
        return resultCourse;
    }

    const changeCourse =  newCourse => {
        setSnakeCourse(getCorrectedCourse(newCourse));
    }

    const keydownHandler = (event) => {
        let snakeCourse;
        if (event.code === 'ArrowUp') {
            snakeCourse = 'up';
        } else if (event.code === 'ArrowDown') {
            snakeCourse = 'down';
        } else if (event.code === 'ArrowRight') {
            snakeCourse = 'right';
        } else if (event.code === 'ArrowLeft') {
            snakeCourse = 'left';
        }
        changeCourse(snakeCourse);
    }

    return {
        snakeCourse,
        changeCourse
    }
}