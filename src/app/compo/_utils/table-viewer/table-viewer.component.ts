import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-viewer',
  templateUrl: './table-viewer.component.html',
  styleUrls: ['./table-viewer.component.css', './table-custom.css'],
})
export class TableViewerComponent {
  tables: string[] = [];
  selectedTable = '';
  lines: any[] = [];
  sql = '';
  sqlResult: any[] = [];
  colDetails = '';
  colDetails2 = '';

  private myUrl: string;

  constructor(private http: HttpClient) {
    this.myUrl = environment.apiUrl + '/tables/';
  }

  getTables() {
    this.http.get<string[]>(this.myUrl).subscribe(
      data => {
        // console.log("getTables data : ", data)
        this.tables = data.sort((a, b) => a.localeCompare(b));
      },
      error => {
        console.log("getTables error : ", error)
      }
    );
  }

  selectTable(table: string) {
    this.selectedTable = table;
    this.http.get<any[]>(this.myUrl + table).subscribe(
      data => {
        // console.log("selectTable data : ", data)
        this.lines = data

      }
    );
  }

  deleteTableData(table: string) {
    this.http.delete(this.myUrl + table).subscribe(() => {
      if (table === this.selectedTable) this.lines = [];
    });
  }

  executeSql(fctSuccess: Function = null) {
    this.http.post<any[]>(this.myUrl + 'execute', this.sql, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      result => {
        this.sqlResult = result
        this.getTables()
        if (fctSuccess) fctSuccess()
        if (this.selectedTable) {
          this.selectTable(this.selectedTable)
        }
      }
    );
  }

  ///////////

  getKeys(obj: any): string[] {
    return this.getKeysStartWithIdAndOrdered(obj);
  }

  getKeysStartWithId(obj: any): string[] {
    const keys = Object.keys(obj);
    const idKey = keys.find(k => k.toLowerCase() === 'id'); // détecte la clé "id" quelle que soit la casse
    return idKey ? [idKey, ...keys.filter(k => k !== idKey)] : keys;
  }

  getKeysStartWithIdAndOrdered(obj: any): string[] {
    const keys = Object.keys(obj);
    const idKey = keys.find(k => k.toLowerCase() === 'id');
    const otherKeys = keys.filter(k => k !== idKey).sort((a, b) => a.localeCompare(b));
    return idKey ? [idKey, ...otherKeys] : otherKeys;
  }


  getClassOfTable(table: string) {
    return table == this.selectedTable ? "tblSelected" : ""
  }

  ////////////////////////

  @ViewChild('leftPanel') leftPanel!: ElementRef;
  isResizing = false;

  startResizing(event: MouseEvent) {
    this.isResizing = true;
    const startX = event.clientX;
    const startWidth = this.leftPanel.nativeElement.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 150 && newWidth < 600) {
        this.leftPanel.nativeElement.style.width = `${newWidth}px`;
      }
    };

    const stopResizing = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }

  /////////////////////////////

  confirmDeleteAllRowsOfTable() {
    if (confirm(`Are you sure you want to delete all rows of table "${this.selectedTable}" ?`)) {
      this.deleteTableData(this.selectedTable);
    }
  }

  confirmDeleteTable() {
    if (confirm(`Are you sure you want to delete table "${this.selectedTable}" ?`)) {
      this.deleteTable(this.selectedTable);

    }
  }

  deleteTable(table: string) {
    this.sql = `DROP TABLE ${this.selectedTable} ;`;
    this.executeSql(
      () => {
        this.selectedTable = null
        this.lines = []
      }
    )
  }

  generateDeleteRow() {
    // On prend la première clé comme id par défaut
    const keys = this.lines && this.lines.length ? this.getKeys(this.lines[0]) : [];
    const idKey = keys[0] || 'id';
    this.sql = `DELETE FROM ${this.selectedTable} WHERE ${idKey} = ?;`;
  }

  generateInsertRow() {
    if (!this.lines || !this.lines.length) {
      alert('Table has no rows to infer columns.');
      return;
    }
    const keys = this.getKeys(this.lines[0]);
    const assignments = keys.map(k => `${k} = ?`).join(', ');
    this.sql = `INSERT INTO ${this.selectedTable} SET ${assignments};`;
  }

  generateUpdateRow() {
    if (!this.lines.length) {
      alert('Table has no rows to infer columns.');
      return;
    }

    const keys = this.getKeys(this.lines[0]);
    const idKey = keys.find(k => k.toLowerCase() === 'id') || keys[0];

    const otherKeys = keys.filter(k => k !== idKey);

    const setClause = otherKeys.map(k => `${k} = ?`).join(', ');

    this.sql =
      `UPDATE ${this.selectedTable} SET ${setClause} WHERE ${idKey} = ?;`;
  }


  addTableLike() {
    this.sql = `CREATE TABLE ${this.selectedTable}_copy AS SELECT * FROM ${this.selectedTable};`;
    this.executeSql(
      () => {
        //
      }
    )

  }



}
