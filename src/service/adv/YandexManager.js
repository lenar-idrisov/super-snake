export default class YandexManager {
    init = (handler) => {
        this.getSDK().then(() => {
            // eslint-disable-next-line no-undef
            YaGames
                .init()
                .then(ysdk => {
                    console.log('Yandex SDK', ysdk)
                    window.ysdk = ysdk;
                    window.lang = ysdk.environment.i18n.lang;
                    ysdk.adv.showFullscreenAdv();
                    handler();
                });
        });
    }

    getSDK = _ => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.body.append(script);
            script.src = 'https://yandex.ru/games/sdk/v2';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
        });
    }

    // полноэкранная реклама
    showFullscreenAdv = () => {
        window.ysdk.adv.showFullscreenAdv();
        console.log('ShowedFullScreenAdv!');
    }

    // видеореклама
    showRewardedVideo = (successHandler, errorHandler) => {
        window.ysdk.adv.showRewardedVideo({
            callbacks: {
                onRewarded: () => {
                    console.log('Rewarded!');
                    successHandler();
                },
                onError: (e) => {
                    console.log('Rewarded video error:', e);
                    errorHandler ? errorHandler() : successHandler();
                }
            }
        });
    }

    // реклама при выходе из игры
    showAdvBeforeExit(isEnable) {
        if (isEnable && this.isFullScreenMode) {
            this.showFullscreenAdv();
        }
    }

    // открываем другую игру
    openOtherGame = _ => {
        const host = window.location.href.indexOf('yandex.ru') !== -1 ? 'yandex.ru' : 'yandex.com';
        const otherGameUrl = `https://${host}/games/play/185486`;
        window.open(
            otherGameUrl,
            '_blank'
        );
    }

    // проверка, игра сейчас на весь экран открыта
    isFullScreenMode = _ =>
        window.ysdk.screen.fullscreen.status === 'off';
}