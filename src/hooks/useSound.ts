import {useState, useEffect, useRef} from 'react';

import SoundEat from '../assets/sound/eat.wav';
import SoundFail from '../assets/sound/fail.mp3';
import SoundWin from '../assets/sound/win.mp3';
import SoundPause from '../assets/sound/pause.mp3';


interface SoundList {
    [index: string]: HTMLAudioElement;
    eat: HTMLAudioElement;
    fail: HTMLAudioElement;
    win: HTMLAudioElement;
    pause: HTMLAudioElement;
}

export default () => {
    const soundsRef = useRef<SoundList>();
    const [isSoundDisable, setSoundEnable] = useState(false);

    useEffect(() => {
        // предварительно загружаем звуки
        soundsRef.current = {
            eat: new Audio(SoundEat),
            fail: new Audio(SoundFail),
            win: new Audio(SoundWin),
            pause: new Audio(SoundPause),
        };
    }, [])

    const switchSound = () => {
        setSoundEnable(!isSoundDisable);
        for (const key in soundsRef.current) {
            soundsRef.current[key].volume = isSoundDisable ? 0 : 1;
        }
    }

    const playSound = (name: string) => {
        if (soundsRef.current) {
            soundsRef.current[name].currentTime = 0;
            soundsRef.current[name].play();
        }
    }

    return {
        isSoundDisable,
        playSound,
        switchSound
    }
}