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

  selectedRow: any = null;          // la ligne sélectionnée
  selectedRowIndex: number = null;
  rowInEdit: any = null;            // copie de ligne en édition
  isEditing: boolean = false;       // mode édition
  newRow: any = null;               // nouvelle ligne insérée
  isInserting: boolean = false;     // mode insertion

  editingIndex: number | null = null;
  insertingIndex: number | null = null;

  infos = ""


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
    this.infos = ""

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
      }, error => {
        this.infos = JSON.stringify(error)
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

  ////////////////////////////////

  infoSelectLine() {
    alert("Veuillez selectionner une ligen svp !")
  }

  selectRow(row: any, index: number) {
    this.selectedRow = row;
    this.selectedRowIndex = index;
  }

  deleteSelectedRow() {
    if (!this.selectedRow) {
      this.infoSelectLine()
      return;
    }

    const keys = this.getKeys(this.selectedRow);
    const idKey = keys.find(k => k.toLowerCase() === 'id') || keys[0];

    if (!confirm(`Delete row with ${idKey} = ${this.selectedRow[idKey]} ?`)) return;

    this.sql = `DELETE FROM ${this.selectedTable} WHERE ${idKey} = ${this.selectedRow[idKey]};`;

    this.executeSql(
      () => {
        this.cancelEdit()
      }
    )
  }

  startEditSelectedRow() {
    // if (this.selectedRowIndex == null) return;
    if (!this.selectedRow) {
      this.infoSelectLine()
      return;
    }

    this.isEditing = true;
    this.isInserting = false;

    this.editingIndex = this.selectedRowIndex;

    this.rowInEdit = { ...this.selectedRow }; // copy object
  }

  saveRow() {
    if (this.isEditing) {
      const keys = this.getKeys(this.rowInEdit);
      const idKey = keys.find(k => k.toLowerCase() === 'id') || keys[0];

      const setClause = keys
        .filter(k => k !== idKey)
        .map(k => `${k} = '${this.rowInEdit[k]}'`)
        .join(', ');

      this.sql = `UPDATE ${this.selectedTable} SET ${setClause} WHERE ${idKey} = ${this.rowInEdit[idKey]};`;

      this.executeSql(
        () => {
          //
        }
      )

      this.isEditing = false;
      this.editingIndex = null;
    }

    if (this.isInserting) {
      const keys = this.getKeys(this.newRow);
      const nonIdKeys = keys.filter(k => k.toLowerCase() !== 'id');

      const columns = nonIdKeys.join(', ');
      const values = nonIdKeys.map(k => `'${this.newRow[k]}'`).join(', ');

      this.sql =
        `INSERT INTO ${this.selectedTable} (${columns}) VALUES (${values});`;

      this.executeSql();

      this.isInserting = false;
      this.insertingIndex = null;
    }
  }


  insertLikeSelectedRow() {
    if (!this.selectedRow) {
      this.infoSelectLine()
      return;
    }

    this.isEditing = false;
    this.isInserting = true;

    // clone la ligne sélectionnée
    this.newRow = { ...this.selectedRow }; // copy object

    // id doit être null
    const idKey = Object.keys(this.newRow).find(k => k.toLowerCase() === 'id');
    if (idKey) this.newRow[idKey] = null;

    // On insère visuellement une ligne sous la ligne sélectionnée
    this.insertingIndex = this.selectedRowIndex + 1;
    this.lines.splice(this.insertingIndex, 0, this.newRow);

  }

  insertRow() {
    this.isEditing = false;
    this.isInserting = true;

    // Si la table n'a aucune ligne, on ne sait pas les colonnes → erreur
    if (!this.lines || this.lines.length === 0) {
      alert("La table n'a aucune ligne pour déterminer les colonnes !");
      return;
    }

    // Créer une ligne vide avec toutes les colonnes = null
    const emptyRow: any = {};
    const keys = this.getKeys(this.lines[0]);

    keys.forEach(k => emptyRow[k] = null);

    // L'ID doit rester null
    const idKey = keys.find(k => k.toLowerCase() === 'id');
    if (idKey) emptyRow[idKey] = null;

    // Ajouter la ligne vide au tableau visuel
    this.insertingIndex = 0; // ou à la fin : this.lines.length
    this.lines.splice(this.insertingIndex, 0, emptyRow);

    // Stocker comme ligne en insertion
    this.newRow = emptyRow;
  }


  cancelEdit() {

    if (this.isInserting && this.insertingIndex !== null) {
      this.lines.splice(this.insertingIndex, 1);  // ✅ bon : supprimer 1 ligne
    }

    this.isEditing = false;
    this.isInserting = false;
    this.editingIndex = null;
    this.insertingIndex = null;
    this.newRow = null;
    this.selectedRow = null
    this.selectedRowIndex = null

    this.rowInEdit = null;         
    this.infos = ""
  }

  ////////////////////////////////

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
