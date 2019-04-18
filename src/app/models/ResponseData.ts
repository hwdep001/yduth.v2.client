export class ResponseDate {
    res: boolean;
    code: number;
    msg: String;
    data: any;

    constructor(data: Partial<ResponseDate>) {
        Object.assign(this, data);
    }

    toErrString(): string {
        return `${this.code}: ${this.msg}`;
    }
}
