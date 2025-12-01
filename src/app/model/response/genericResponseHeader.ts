
/***
 ** @Author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 ** @Date 23/09/2019
 ** @Time 17:43
 **
 ***/

export class GenericResponseHeader {
  statusCode: string;
  errorMsg: string;
  key: string;
  description: string;
  providerCode: string;
  providerDescription: string;
  errors: string[];
  messageType: string;
}
