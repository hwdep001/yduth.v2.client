import { Sub } from './Sub';

export class Cat {
    id: number;
    name: string;
    version: string;
    createDate: Date;
    updateDate: Date;
    num: number;
    subId: string;
    typeId: number;

    sub: Sub;
}
