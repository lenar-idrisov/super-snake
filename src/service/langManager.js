const dictionary = [
    ['Войдите в аккаунт, чтобы оценить игру', 'Log in to your account to rate the game'],
    ['Вы уже оценивали игру ранее', 'Have you evaluated the game before'],
    ['Попробуйте оценить игру позже', 'Try to rate the game later'],

    ['Выберите цвет игровой области', 'Choose the color of the game area'],
    ['( доступно после рекламы )', '(available after the ad)'],
    ['Старт', 'Go'],
    ['Играть', 'Play'],
    ['Играть еще', 'Restart'],
    ['Другая игра', 'Other game'],
]

// возвращает переведенный на нужный язык текст
export default function tr(message) {
    let targetPair = dictionary.find(pair => pair[0] === message);
    if (!targetPair) {
        const fullMessage = 'not translated: ' + message;
        console.log('%c' + fullMessage, `background: red; color: yellow; font-size: 15px`);
    }
    targetPair = targetPair || [message, message];
    return window.lang === 'en' ? targetPair[1] : targetPair[0];
}