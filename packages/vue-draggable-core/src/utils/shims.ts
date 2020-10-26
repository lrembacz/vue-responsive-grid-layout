export function findInArray(array: Array<any> | TouchList, cb: Function): any {
    for (let i = 0, length = array.length; i < length; i++) {
        if (cb.apply(cb, [array[i], i, array])) return array[i];
    }
}

export function isFunction(func: any): boolean {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

export function isNum(num: any): boolean {
    return typeof num === 'number' && !isNaN(num);
}
