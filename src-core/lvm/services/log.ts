export class Log {
    private static _prefix: string = "[LAS-CORE]";

    /* tslint:disable:no-console */

    public static info(message) {
        console.info(`${Log._prefix}{INFO} - ${message}`);
    }

    public static debug(message) {
        console.debug(`${Log._prefix}{DEBUG} - ${message}`);
    }

    public static log(message) {
        console.log(`${Log._prefix}{LOG} - ${message}`);
    }

    public static warn(message) {
        console.warn(`${Log._prefix}{WARN} - ${message}`);
    }

    public static error(message) {
        console.error(`${Log._prefix}{ERROR} - ${message}`);
    }
}
