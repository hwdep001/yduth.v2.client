export class ResponseData {
    res: boolean;
    code: number;
    msg: String;
    data: any;

    constructor(data: Partial<ResponseData>) {
        Object.assign(this, data);
    }

    toErrString(): string {
        return `CODE: ${this.code} - ${this.msg}`;
    }
}
