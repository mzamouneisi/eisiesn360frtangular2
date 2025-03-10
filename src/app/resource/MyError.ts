export class MyError {
    title: string;
    msg: string;
    providerCode: string;
    providerDescription: string;
    statusCode: string;

    constructor(title:string, msg:string) {
      this.title = title;
      this.msg = msg;
    }
  }