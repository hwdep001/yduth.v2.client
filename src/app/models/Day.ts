import { Cat } from './Cat';

export class Day {
    id: number;
    name: string;
    createDate: Date;
    updateDate: Date;
    num: number;
    catId: number;

    cat: Cat;

    // for UI
    checked: boolean;
}
