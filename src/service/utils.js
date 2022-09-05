export default  function randAB(min, max, excludedList = []) {
    let randVal;
    min = Math.ceil(min);
    max = Math.floor(max);
    let iterator = 0;
    do {
        randVal = Math.floor(Math.random() * (max - min + 1)) + min;
        iterator++;
        if (iterator === 1000) break;
        //logBeauty('randAB', 'while loop', 1);
    } while (excludedList.some(i => randVal === i));
    return randVal;
}