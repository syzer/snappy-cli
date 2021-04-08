declare module 'yargs-promise' {
    import yargs from 'yargs';

    type YargsPromiseLike<T> = {
        error?: Error | undefined;
        argv?: T;
        data?: string;
    }

    class YargsPromise<T> {
        constructor(program: yargs.Argv);
        yargs: yargs.Argv;
        parse(msg: string, context?: object, parseCallback?: yargs.ParseCallback<T>): Promise<YargsPromiseLike<T>>;
    }

    export = YargsPromise;
}