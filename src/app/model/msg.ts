import { Consultant } from './consultant';

export class Msg {
	id: number;
	dateMsg: Date;
    msg: string;
    type: string;
    typeId: number;
    isReadByTo: boolean;

    from: Consultant;
    fromId: number
    to: Consultant;
    toId : number
}
