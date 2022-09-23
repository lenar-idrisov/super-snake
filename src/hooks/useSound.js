import {useState, useEffect, useRef} from 'react';

import SoundEat from '../assets/sound/eat.wav';
import SoundFail from '../assets/sound/fail.mp3';
import SoundWin from '../assets/sound/win.mp3';
import SoundPause from '../assets/sound/pause.mp3';

export default _ => {
    const soundsRef = useRef();
    const [isSoundEnable, setSoundEnable] = useState(true);

    useEffect(_ => {
        // предварительно загружаем звуки
        soundsRef.current = {
            eat: new Audio(SoundEat),
            fail: new Audio(SoundFail),
            win: new Audio(SoundWin),
            pause: new Audio(SoundPause),
        };
    }, [])

    const switchSound = _ => {
        setSoundEnable(!isSoundEnable);
        for (const key in soundsRef.current) {
            soundsRef.current[key].volume = isSoundEnable ? 0 : 1;
        }
    }

    const playSound = (name) => {
        soundsRef.current[name].currentTime = 0;
        soundsRef.current[name].play();
    }

    return {
        isSoundEnable,
        playSound,
        switchSound
    }
}