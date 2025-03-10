/***
 ** @Author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 ** @Date 24/09/2019
 ** @Time 10:50
 **
 ***/
export class Role {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comment: string;

  get toString(): string {
    return this.name;
  }
}
