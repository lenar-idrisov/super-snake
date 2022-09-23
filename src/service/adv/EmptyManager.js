export default class EmptyManager {
    // нужен, чтобы в консоль ошибки не сыпались от яндекс рекламы
    init = (handler) => {
        window.lang = 'ru';
        handler();
    }

    // полноэкранная реклама
    showFullscreenAdv = () => {
    }

    // видеореклама
    showRewardedVideo = (successHandler, errorHandler) => {
        successHandler();
    }

    // реклама при выходе из игры
    showAdvBeforeExit(isEnable) {
    }

    // открываем другую игру
    openOtherGame = (name) => {
        const host = 'yandex.ru';
        const games = {
            tetris: `https://${host}/games/play/181901`,
            seaBattle: `https://${host}/games/play/181327`,
            snake: `https://${host}/games/play/195850`,
        }
        window.open(
            games[name],
            '_blank'
        );
    }

    // проверка, игра сейчас на весь экран открыта
    isFullScreenMode = _ => false

    // оценка игры
    rateGame = _ => {
    }
}