import {Consultant} from './consultant';

export class Msg {
	id: number;
	dateMsg: Date;
    msg: string;
    type: string;
    typeId: number;
    from: Consultant;
    to: Consultant;
    isReadByTo: boolean;
}
