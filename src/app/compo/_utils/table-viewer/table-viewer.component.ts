import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Relation } from 'src/app/model/relation';
import { TableService } from 'src/app/service/table.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-viewer',
  templateUrl: './table-viewer.component.html',
  styleUrls: ['./table-viewer.component.css', './table-custom.css'],
})
export class TableViewerComponent implements OnInit {
  tables: string[] = [];
  selectedTable = '';
  lines: any[] = [];
  sql = '';
  sqlResult: any[] = [];
  colDetails = '';
  colDetails2 = '';

  selectedRow: any = null;          // la ligne sélectionnée
  selectedRowIndex: number = null;
  rowInEdit: any = null;            // copie de ligne en édition
  isEditing: boolean = false;       // mode édition
  newRow: any = null;               // nouvelle ligne insérée
  isInserting: boolean = false;     // mode insertion

  editingIndex: number | null = null;
  insertingIndex: number | null = null;

  infos = ""

  // columnMetadata: ColumnDetails[] = [];
  columnMetadata: any[] = [];

  apiUrl = environment.apiUrl


  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.getTables(
      () => {
        if (this.tables && this.tables.length) {
          this.selectTable(this.tables[0])
          let t0 = 100
          let t = t0
          setTimeout(() => {
            this.openTabData()
          }, t += t0);
          // setTimeout(() => {
          //   this.openRelations()
          // }, t+=t0);
          // setTimeout(() => {
          //   this.openTabData()
          // }, t+=t0);

        }
      }
    )
  }

  getTables(fOk: Function = null) {
    this.tableService.getTables(
      (data) => {
        this.tables = data.map(t => t);
        if (fOk) fOk()
      }, (err) => {
        this.infos = JSON.stringify(err)
      }
    )
  }

  public mapColType = {}
  public mapColTypeInput = {}

  selectTable(table: string) {
    let fct = "selectTable"
    this.selectedTable = table;
    this.lines = []; // Videz les lignes pour un chargement propre
    this.columnMetadata = []; // Videz les métadonnées

    // 1. Récupérer les lignes de la table
    this.tableService.getLinesOfTable(this.selectedTable,
      data => {
        this.lines = data;
        console.log(fct + " getLinesOfTable data : ", data)
      }, (err) => {
        console.log(fct + " getLinesOfTable err : ", err)
      }
    );

    // 2. Récupérer les détails des colonnes

    this.tableService.getColsOfTable(this.selectedTable,
      (columnMetadata, mapColType, mapColTypeInput) => {
        console.log(fct + " getColsOfTable columnMetadata : ", columnMetadata)
        this.columnMetadata = columnMetadata;
        this.mapColType = mapColType;
        this.mapColTypeInput = mapColTypeInput;
        console.log(fct + " getColsOfTable mapColType : ", mapColType)
      }, err => {
        console.log(fct + " getColsOfTable err : ", err)
      }
    );

    // setTimeout(() => {

    //   console.log(fct + " go to call getColsOfTable")

    //   this.tableService.getColsOfTable(this.selectedTable,
    //     (columnMetadata, mapColType, mapColTypeInput) => {
    //       this.columnMetadata = columnMetadata;
    //       this.mapColType = mapColType;
    //       this.mapColTypeInput = mapColTypeInput;
    //       console.log(fct + " getColsOfTable mapColType : ", mapColType)
    //     }, (err) => {
    //       console.log(fct + " getColsOfTable err : ", err)
    //     }
    //   );
    // }, 1000);

    // 3. TODO : on retravaille lines afin les valeurs des colonnes de type date / timestamp en Date 
  }

  getTypeInput(col: string) {
    return this.tableService.getTypeInput(col, this.mapColType);
  }

  getValueForInput(key: string, value: any): any {

    if (!value) {
      return null;
    }

    key = key

    // 1. Vérifiez si c'est un champ date/time
    const type = this.getTypeInput(key);
    if (type !== 'datetime-local' && type !== 'date' && type !== 'time') {
      return value; // Pas de formatage nécessaire
    }

    // 2. Formater la chaîne ISO (ex: "2025-09-09T19:59:59.906+00:00")
    if (typeof value === 'string') {
      // Si la valeur est un timestamp avec des millisecondes et/ou un fuseau horaire, 
      // l'input type="datetime-local" ne prend que la partie YYYY-MM-DDTHH:MM

      // Pour une précision à la minute (standard pour datetime-local)
      const match = value.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
      if (match) {
        return match[1]; // Retourne 'YYYY-MM-DDTHH:MM'
        // return this.toDateTimeLocal(value)
      }



      // Si vous voulez la seconde (datetime-local supporte aussi les secondes)
      // const matchWithSeconds = value.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/); 
      // ...

      // Si le format est juste YYYY-MM-DD (pour input type="date")
      if (type === 'date') {
        return value.substring(0, 10);
      }
    }

    // Si le formatage échoue ou si ce n'est pas une chaîne
    return value;
  }

  // Dans TableViewerComponent

  /**
   * Formatte la valeur pour une requête SQL basée sur son type de colonne.
   * @param key Le nom de la colonne.
   * @param value La valeur de la cellule.
   * @returns La valeur formatée pour la requête SQL (avec/sans quotes, ou 'null').
   */
  formatSqlValue(key: string, value: any): any {
    // 1. Trouvez le type de données de la colonne
    // const metadata = this.columnMetadata.find(col => col.columnName === key);
    const metadata = this.columnMetadata.find(col => col.columnName === key);

    // console.log("formatSqlValue : key, value, metadata : ", key, value, metadata)

    let res = null

    // Si pas de metadata (cela ne devrait pas arriver si selectTable a fonctionné)
    if (!metadata) {
      res = `'${value}'`; // Par défaut, traitez comme une chaîne
      // console.log("formatSqlValue : res : ", res)
      return res;
    }

    // 2. Gérer le cas 'null'
    if (!value || (value + "").toUpperCase() === 'NULL') {
      res = 'null';
      // console.log("formatSqlValue : res : ", res)
      return res;
    }

    // 3. Normaliser le type de données
    const dataType = metadata.dataType.toLowerCase();
    // console.log("formatSqlValue : dataType : =/" + dataType + "/", dataType)

    // Exemples de types numériques/booléens (à adapter à votre SGBD)
    if (dataType.includes('int') || dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('real')) {
      // Types numériques
      // Assurez-vous que la valeur est propre (si elle vient du champ input, elle est déjà string)
      // On enlève les quotes
      res = String(value);
      // console.log("formatSqlValue NUM : res : ", res)
    }

    else if (dataType.includes('bool') || dataType.includes('boolean')) {
      // Types booléens
      // On renvoie 'true' ou 'false' (sans quotes) ou la valeur elle-même si elle est déjà un nombre (0/1)
      res = String(value).toLowerCase() === 'true' || value === 1 ? true : false;
      // console.log("formatSqlValue : res : ", res)
    }

    else if (dataType.includes('char') || dataType.includes('string')) {
      res = "'" + String(value) + "'";
      // console.log("formatSqlValue : res : ", res)
    } else {

      // 4. Par défaut (texte, varchar, date, timestamp, etc.) : entourer de quotes
      // ATTENTION: Échapper les quotes simples dans la valeur si votre SGBD ne le fait pas automatiquement.
      // Pour la simplicité ici, on assume que ce n'est pas nécessaire, mais c'est un risque.
      const escapedValue = String(value).replace(/'/g, "''"); // Échappement classique SQL
      res = `'${escapedValue}'`;
      // console.log("formatSqlValue : res : ", res)
    }

    return res;
  }

  deleteTableData(table: string) {
    this.tableService.deleteTableData(table,
      () => { },
      () => { }
    )
  }

  executeSql(fctSuccess: Function = null) {
    this.infos = ""
    console.log("executeSql : sql : ", this.sql)

    this.tableService.executeSql(this.sql,
      (sqlResult) => {
        this.sqlResult = sqlResult
        console.log("executeSql : sqlResult : ", sqlResult)
        if (!sqlResult.body && sqlResult.header && sqlResult.header.description) {
          this.infos = sqlResult.header.description
        } else {
          this.getTables(null)
          if (this.selectedTable) {
            this.selectTable(this.selectedTable)
          }
          if (fctSuccess) fctSuccess()
        }
      },
      (infos) => {
        this.infos = infos
        console.log("executeSql : infos : ", infos)
      }
    )
  }

  ///////////

  getKeys(obj: any): string[] {
    return this.getKeysStartWithIdAndOrdered(obj);
  }

  getKeysStartWithId(obj: any): string[] {
    const keys = Object.keys(obj);
    const idKey = keys.find(k => k.toUpperCase() === 'ID'); // détecte la clé "id" quelle que soit la casse
    return idKey ? [idKey, ...keys.filter(k => k !== idKey)] : keys;
  }

  getKeysStartWithIdAndOrdered(obj: any): string[] {
    const keys = Object.keys(obj);
    const idKey = keys.find(k => k.toUpperCase() === 'ID');
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

  idKeySelected = null

  selectRow(row: any, index: number) {

    if (this.isInserting || this.isEditing) {
      return
    }

    this.selectedRow = row;
    this.selectedRowIndex = index;

    const keys = this.getKeys(this.selectedRow);
    const idKey = keys.find(k => k.toUpperCase() === 'ID') || keys[0];

    this.idKeySelected = this.selectedRow[idKey]
  }

  deleteSelectedRow() {
    if (!this.selectedRow) {
      this.infoSelectLine()
      return;
    }

    const keys = this.getKeys(this.selectedRow);
    const idKey = keys.find(k => k.toUpperCase() === 'ID') || keys[0];

    let msg = `Delete row with ${idKey} = ${this.selectedRow[idKey]} ?`
    if (this.selectedTable.toUpperCase() === 'ESN') {
      msg += "\nThis will also delete all related data in other tables (RESP_ESN, ESN_PROJECT, CRA, etc.) !"
    }

    if (!confirm(msg)) return;

    if (!this.selectedRow[idKey]) this.selectedRow[idKey] = null

    let eqaulOrIs = this.selectedRow[idKey] ? '=' : 'is'

    let sql = `DELETE FROM ${this.selectedTable} WHERE ${idKey} ${eqaulOrIs} ${this.selectedRow[idKey]};`;
    if (this.selectedTable.toUpperCase() === 'ESN') {
      sql = `\nDELETE FROM NOTIFICATION WHERE CRA_ID in (select c.id from CRA c JOIN CONSULTANT cons ON c.consultant_id = cons.id where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]});`;
      sql += `\nDELETE FROM CRA_DAY_ACTIVITY WHERE ACTIVITY_ID in (select id from activity where consultant_id in (select id from consultant where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]}));`;
      sql += `\nDELETE FROM CRA_DAY WHERE CRA_ID in (select c.id from CRA c JOIN CONSULTANT cons ON c.consultant_id = cons.id where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]});`;
      sql += `\nDELETE FROM CRA WHERE consultant_id in (select id from consultant where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]});`;
      sql += `\nDELETE FROM activity WHERE consultant_id in (select id from consultant where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]});`;
      sql += `\nDELETE FROM activity_type WHERE ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]};`;
      sql += `\nDELETE FROM project WHERE client_id in (select id from client where ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]});`;
      sql += `\nDELETE FROM client WHERE ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]};`;
      sql += `\nUPDATE consultant SET ADMIN_CONSULTANT_ID = NULL WHERE ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]};`;
      sql += `\nDELETE FROM consultant WHERE ESN_ID ${eqaulOrIs} ${this.selectedRow[idKey]};`;
      sql += `\nDELETE FROM ${this.selectedTable} WHERE ${idKey} ${eqaulOrIs} ${this.selectedRow[idKey]};`;
    }

    this.sql = sql;

    this.executeSql(
      () => {
        this.cancelEdit()
      }
    )
  }

  saveRow() {
    if (this.isEditing) {
      const keys = this.getKeys(this.rowInEdit);
      const idKey = keys.find(k => k.toUpperCase() === 'ID') || keys[0];

      const setClause = keys
        // .filter(k => k !== idKey)
        // *** MODIFICATION ICI ***
        .map(k => `${k} = ${this.formatSqlValue(k, this.rowInEdit[k])}`)
        // ************************
        .join(', ');

      if (!this.selectedRow[idKey]) this.selectedRow[idKey] = null
      if (!this.idKeySelected) this.idKeySelected = null

      let eqaulOrIs = this.idKeySelected ? '=' : 'is'

      this.sql = `UPDATE ${this.selectedTable} SET ${setClause} WHERE ${idKey} ${eqaulOrIs} ${this.idKeySelected};`;

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
      // const nonIdKeys = keys.filter(k => k.toUpperCase() !== 'ID');
      const nonIdKeys = keys;

      const columns = nonIdKeys.join(', ');
      // *** MODIFICATION ICI ***
      const values = nonIdKeys
        .map(k => this.formatSqlValue(k, this.newRow[k]))
        .join(', ');
      // ************************

      this.sql =
        `INSERT INTO ${this.selectedTable} (${columns}) VALUES (${values});`;

      this.executeSql();

      this.isInserting = false;
      this.insertingIndex = null;
    }
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
    const idKey = Object.keys(this.newRow).find(k => k.toUpperCase() === 'ID');
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
    const idKey = keys.find(k => k.toUpperCase() === 'ID');
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


  addTableLike() {
    this.sql = `CREATE TABLE ${this.selectedTable}_copy AS SELECT * FROM ${this.selectedTable};`;
    this.executeSql(
      () => {
        //
      }
    )

  }

  //////////////////////////////////

  activeTab: "data" | "relations" | "structure" | "sql" = "data";
  relationsData: Relation[] = [];  // contenu JSON des relations pour D3


  openRelations() {
    if (!this.selectedTable) {
      alert("Veuillez sélectionner une table.");
      return;
    }

    this.activeTab = "relations";

    console.log("openRelations : selectedTable : ", this.selectedTable)

    // Charger les relations du backend
    this.tableService.openRelations(
      (res) => {
        this.relationsData = res;
      },
      (err) => {

      }
    )

  }

  openTabData() {
    let fct = "openTabData"
    if (!this.selectedTable) {
      alert("Veuillez sélectionner une table.");
      return;
    }

    this.activeTab = "data";

    console.log(fct + " : selectedTable : ", this.selectedTable)

    // Charger les relations du backend
    this.selectTable(this.selectedTable)

  }

  onCellTableDblClick(event: any) {
    console.log("onCellTableDblClick")
    // TODO : copier la valeur de la cellule dans le presse-papier. et afficher une notification : cell copied to clipboard. Implementer cela.
    const text = event.target.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("Cell value copied to clipboard: " + text);
    }).catch(err => {
      alert("Failed to copy text: " + err);
    });
  }

}
