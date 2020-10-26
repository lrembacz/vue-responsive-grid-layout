const DEBUG = false;

export default function log(...args: any[]) {
    if (DEBUG) console.log(...args);
}
