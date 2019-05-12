import { Sub } from './Sub';

export class User {
    uid: string;
    email: string;
    googlePhotoUrl: string;
    nickname: string;
    photo: string;

    subList: Array<Sub>;
}
