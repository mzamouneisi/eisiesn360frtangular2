import {Consultant} from './consultant';

export class MsgHisto {

	id: number;
    msg: string;
	dateMsg: Date ;
    type: string;
    typeId: number;
    from: Consultant;
    to: Consultant;
    isReadByTo: boolean;
}
