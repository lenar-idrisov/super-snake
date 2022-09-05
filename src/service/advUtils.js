import YandexManager from './adv/YandexManager';

export function isSite(siteName) {
    //console.log(getUrlParams(), window.location);
    return (window.location.hostname.includes(siteName) ||
        window.location.search.includes(siteName));
}

/*export function getUrlParams() {
    const uri = window.location.search.substring(1);
    const partParams = uri.split('&');
    const paramsObj = {};

    if (!partParams.length) {
        return;
    }

    partParams.forEach((item) => {
        const [key, value] = item.split('=');
        paramsObj[key] = value;
    });
    return paramsObj;
}*/

export function getAdvManager() {
    let manager;
    manager = new YandexManager();
    return manager;
}