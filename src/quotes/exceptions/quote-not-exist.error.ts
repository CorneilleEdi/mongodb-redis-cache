export class QuoteNotExistError extends Error {
    constructor(key?: string) {
        super(`Quote ${key} do not exist`);
    }
}
