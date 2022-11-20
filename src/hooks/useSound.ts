import {useEffect, useRef} from 'react';
import {useActionsWithDispatch, useTypedSelector} from "./baseHooks";
import SoundEat from '../assets/sound/eat.wav';
import SoundFail from '../assets/sound/fail.mp3';
import SoundWin from '../assets/sound/win.mp3';
import SoundPause from '../assets/sound/pause.mp3';
import {SoundList} from "../types/functionTypes";
import {flagSlice} from "../store/reducers/flags";


export default () => {
    const soundsRef = useRef<SoundList>();
    const {isSoundDisable} = useTypedSelector(state => state.flags);
    const {switchSoundEnable} = useActionsWithDispatch(flagSlice);

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
        let key: keyof SoundList;
        if (soundsRef.current) {
            for (key in soundsRef.current) {
                soundsRef.current[key].volume = isSoundDisable ? 1 : 0;
            }
        }
        switchSoundEnable();
    }

    const playSound = (name: keyof SoundList) => {
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