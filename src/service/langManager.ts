import {showError} from "./utils";

const dictionary = [
    ['Войдите в аккаунт, чтобы оценить игру', 'Log in to your account to rate the game'],
    ['Вы уже оценивали игру ранее', 'Have you evaluated the game before'],
    ['Попробуйте оценить игру позже', 'Try to rate the game later'],

    ['Выберите цвет игровой области', 'Choose the color of the game area'],
    ['Выбери режим игры','Choose the game mode'],
    ['( доступно после рекламы )', '(available after the ad)'],
    ['Старт', 'Go'],
    ['без барьеров', 'without barriers'],
    ['с барьерами', 'with barriers'],
    ['Играть', 'Play'],
    ['Играть еще', 'Restart'],
    ['Другая игра', 'Other game'],
]

// возвращает переведенный на нужный язык текст
export default function tr(message: string) {
    let targetPair = dictionary.find(pair => pair[0] === message);
    if (!targetPair) {
        const fullMessage = 'not translated: ' + message;
        showError(fullMessage);
    }
    targetPair = targetPair || [message, message];
    return (window as any).lang === 'en' ? targetPair[1] : targetPair[0];
}