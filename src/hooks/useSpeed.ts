import {useState} from 'react';

export default () => {
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

    function getSpeed(speedNum: number) {
        let speedResult = 290;
        if (speedNum === 2) {
            speedResult = 250;
        } else if (speedNum === 3) {
            speedResult = 200;
        } else if (speedNum === 4) {
            speedResult = 150;
        }
        return speedResult;
    }

    return {
        speedNum,
        realSpeed,
        increaseSpeed
    }
}