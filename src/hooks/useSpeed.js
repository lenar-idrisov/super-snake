import {useState} from 'react';

export default _ => {
    const [speedNum, setSpeedNum] = useState(1);
    const [realSpeed, setRealSpeed] = useState(getSpeed(1));

    function increaseSpeed() {
        let newSpeedNum;
        if (speedNum <= 3) {
            newSpeedNum = speedNum + 1;
        } else newSpeedNum = 1;
        setSpeedNum(newSpeedNum);
        setRealSpeed(getSpeed(newSpeedNum));
    }

    function getSpeed(speedNum) {
        let speedResult;
        if (speedNum === 1) speedResult = 290;
        if (speedNum === 2) speedResult = 250;
        if (speedNum === 3) speedResult = 200;
        if (speedNum === 4) speedResult = 150;
        return speedResult;
    }

    return {
        speedNum,
        realSpeed,
        increaseSpeed
    }
}