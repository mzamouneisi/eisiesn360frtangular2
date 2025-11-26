// Définition d'un type pour les détails de colonne
export class ColumnDetails {
  columnName: string;
  dataType: string; // Ex: 'character varying', 'integer', 'timestamp without time zone', 'boolean'
  isNullable: boolean;
}
