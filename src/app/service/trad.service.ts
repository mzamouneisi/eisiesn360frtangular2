import { Injectable } from '@angular/core';

const lang0 = "fr";  //default lang"

@Injectable({
  providedIn: 'root'
})
export class TradService {

  constructor() {
    // localStorage.setItem('locale', code);
    this.lang = localStorage.getItem('locale');
  }

  private lang = lang0;
  public setLang(l: string) {
    this.lang = l;
    localStorage.setItem('locale', l);
  }
  public getLang(): string {
    return this.lang;
  }

  /**
   * 
   * @param cle 
   * @param paramJson 
   * @returns 
   */
  public get(cle: string, paramJson: Object = null): string {
    let res = "";
    let obj = this.data[cle]
    if (obj) {
      res = obj[this.lang]
      if (!res) {
        res = obj[lang0]
        if (!res) res = "";
      }
    }

    if (paramJson && res) {
      for (let key in paramJson) {
        res = res.replace("{{" + key + "}}", paramJson[key])
      }
    }

    return res;
  }

  data = {
    "welcome": {
      fr: "Bienvenue",
      en: "Welcome",
    },
    "Add": {
      fr: "Ajouter",
      en: "Add",
    },

    "Save": {
      fr: "Enregistrer",
      en: "Save",
    },

    "List": {
      fr: "Liste",
      en: "List",
    },

    "New": {
      fr: "Nouveau",
      en: "New",
    },

    "NewFee": {
      fr: "Nouvelle Note frais",
      en: "New Fee",
    },

    "Edit": {
      fr: "Modifier",
      en: "Edit",
    },

    "Download": {
      fr: "T\u00e9l\u00e9charger",
      en: "Download",
    },

    "Accept": {
      fr: "Accepter",
      en: "Accept",
    },

    "Reject": {
      fr: "Rejeter",
      en: "Reject",
    },

    "Pay": {
      fr: "Payer",
      en: "Pay",
    },

    "Delete": {
      fr: "Supprimer",
      en: "Delete",
    },


    "Search": {
      fr: "Chercher",
      en: "Search",
    },

    "User": {
      fr: "Utlisateur",
      en: "User",
    },

    "Consultant": {
      fr: "Consultant",
      en: "Consultant",
    },

    "Frais": {
      fr: "Note Frais",
      en: "Fee",
    },

    "Project": {
      fr: "Project",
      en: "Project",
    },

    "Esn": {
      fr: "Esn",
      en: "Esn",
    },

    "NewActivityType": {
      fr: "Nouvelle activiti\u00e9 type",
      en: "New Activity Type",
    },
    "EditActivityType": {
      fr: "Modifier activiti\u00e9 type",
      en: "Edit Activity Type",
    },

    "NewActivity": {
      fr: "Nouvelle activiti\u00e9",
      en: "New Activity",
    },

    "EditActivity": {
      fr: "Modifier activity",
      en: "Edit Activity"
    },

    "ListActivites": {
      "fr": "Liste d'activites",
      "en": "List Activity"
    },

    "ListActivitesType": {
      "fr": "Liste d'activites type",
      "en": "List Activity Type"
    },

    "NewClient": {
      "fr": "Nouveau Client",
      "en": "New Client"
    },
    "EditClient": {
      "fr": "Modifier Client",
      "en": "Edit Client"
    },



    "Entitled": { fr: "Intitul\u00e9", en: "Entitled" },
    "ListAbsence": { "fr": "Liste absences", "en": "List absence" },

    "Month": {
      fr: "Mois",
      en: "Month",
    },

    "CreatedDate": {
      fr: "Date Creation",
      en: "Created Date",
    },

    "LastUpdateDate": {
      fr: "Date Dernierre MAJ",
      en: "Last Update Date",
    },

    "Status": {
      fr: "Status",
      en: "Status",
    },

    "Action": {
      fr: "Action",
      en: "Action",
    },

    "Role": {
      "fr": "R\u00f4le",
      "en": "Role",
    },

    /////////////////////

    "main.menu.navbar.navitem.caption.navigation.label": {
      "fr": "Navigation",
      "en": "Navigation",
    },
    "main.menu.navbar.navitem.esn.title": {
      "fr": "Gestion Esn",
      "en": "Esn Management",
    },
    "main.menu.navbar.navitem.client.title": {
      "fr": "Gestion Client",
      "en": "Client Management",
    },
    "main.menu.navbar.navitem.project.title": {
      "fr": "Gestion Project",
      "en": "Project Management",
    },
    "main.menu.navbar.navitem.consultant.title": {
      "fr": "Gestion Consultant",
      "en": "Consultant Management",
    },
    "main.menu.navbar.navitem.activityType.title": {
      "fr": "Gestion Type d'Activit\u00e9",
      "en": "Activity Type Management",
    },
    "main.menu.navbar.navitem.activity.title": {
      "fr": "Gestion {{title}} ",
      "en": "{{title}} Management",
    },
    "main.menu.navbar.navitem.cra.title": {
      "fr": "Gestion Cra",
      "en": "Cra Management",
    },
    "main.menu.navbar.navitem.caption.fee.label": {
      "fr": "Gestion des Frais",
      "en": "Fee Management",
    },
    "main.menu.navbar.navitem.fee.category.title": {
      "fr": "Gestion des Cat\u00e9gories de Frais",
      "en": "Fee Category Management",
    },
    "main.menu.navbar.navitem.fee.note.title": {
      "fr": "Gestion des Notes de Frais",
      "en": "Fee Note Management",
    },
    "main.menu.navbar.navitem.fee.dashboard.title": {
      "fr": "Tableau de board",
      "en": "Dashboard",
    },
    "main.menu.navbar.navitem.caption.setting.label": {
      "fr": "R\u00e8glages",
      "en": "Setting",
    },
    "main.menu.navbar.navitem.setting.permission.title": {
      "fr": "Gestion des Autorisations",
      "en": "Permission Management",
    },
    "main.menu.navbar.navitem.setting.holiday.title": {
      "fr": "Gestion de Vacances",
      "en": "Holiday Management",
    },
    "main.menu.navbar.navitem.setting.user.my-profile": {
      "fr": "Mon Profile",
      "en": "My Profile",
    },
    "main.menu.navbar.navitem.setting.user.notification": {
      "fr": "Mes Notifications",
      "en": "My Notifications",
    },
    "main.menu.navbar.navitem.setting.payment.mode.title": {
      "fr": "Gestion Mode de Paiement",
      "en": "Payment Mode Management",
    },
    "app.form.input.placeholder.prefix": {
      "fr": "Entrez Votre",
      "en": "Enter your",
    },
    "app.badge.required": {
      "fr": "est obligatoire",
      "en": "is required",
    },
    "app.compo.esn.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.esn.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.esn.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.esn.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.esn.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.esn.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.esn.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "WebSite",
    },
    "app.compo.esn.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.esn.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.esn.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.esn.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.esn.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
    },
    "app.compo.esn.list.table.action.edit": {
      "fr": "Modifier",
      "en": "Edit",
    },
    "app.compo.esn.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.esn.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.esn.form.input.profession": {
      "fr": "Activites",
      "en": "Activities",
    },
    "app.compo.esn.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.esn.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.esn.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.esn.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.esn.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.esn.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.esn.form.input.email": {
      "fr": "Email de l'ESN",
      "en": "ESN Email",
    },
    "app.compo.esn.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.client.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.client.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.client.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.client.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.client.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.client.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.client.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.client.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.client.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.client.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.client.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.client.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
    },
    "app.compo.client.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.client.form.input.name": {
      "fr": "Name",
      "en": "Name",
    },
    "app.compo.client.form.input.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.client.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.client.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.client.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.client.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.client.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.client.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.client.form.input.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.client.form.input.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.client.form.button.list": {
      "fr": "Retour \u00e0 la Liste",
      "en": "Back to list",
    },
    "app.compo.project.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.project.list.table.thead.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.project.list.table.thead.team": {
      "fr": "Equipe",
      "en": "Team",
    },
    "app.compo.project.list.table.thead.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
    },
    "app.compo.project.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.project.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.project.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.project.list.table.action.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.project.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.project.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.project.form.input.teamNumber": {
      "fr": "Nombre d'\u00e9quipe",
      "en": "TeamNumber",
    },
    "app.compo.project.form.input.teamDesc": {
      "fr": "Description de l'\u00e9quipe",
      "en": "TeamDesc",
    },
    "app.compo.project.form.input.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
    },
    "app.compo.project.form.input.environment": {
      "fr": "Environnement",
      "en": "Environment",
    },
    "app.compo.project.form.input.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.project.form.input.comment": {
      "fr": "Commentaire",
      "en": "Comment",
    },
    "app.compo.project.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.consultant.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.consultant.list.table.thead.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
    },
    "app.compo.consultant.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.consultant.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.consultant.list.table.thead.esn": {
      "fr": "Esn",
      "en": "Esn",
    },
    "app.compo.consultant.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.consultant.list.table.action.edit": {
      "fr": "Editer",
      "en": "edit",
    },
    "app.compo.consultant.list.table.action.delete": {
      "fr": "supprimer",
      "en": "delete",
    },
    "app.compo.consultant.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.consultant.form.input.firstName": {
      "fr": "Pr\u00e9nom",
      "en": "First Name",
    },
    "app.compo.consultant.form.input.lastName": {
      "fr": "Nom",
      "en": "Last Name",
    },
    "app.compo.consultant.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.consultant.form.input.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.consultant.form.input.level": {
      "fr": "Niveau",
      "en": "Level",
    },
    "app.compo.consultant.form.input.birthDay": {
      "fr": "Date de naissance",
      "en": "Birth Day",
    },
    "app.compo.consultant.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.consultant.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.consultant.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "ZipCode",
    },
    "app.compo.consultant.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.consultant.form.input.manager": {
      "fr": "Directeur",
      "en": "Manager",
    },
    "app.compo.consultant.form.input.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
    },
    "app.compo.consultant.form.input.password": {
      "fr": "Mot de passe",
      "en": "Password",
    },
    "app.compo.consultant.form.input.confirmPassword": {
      "fr": "Confirm password",
      "en": "Confirm password",
    },
    "app.compo.consultant.form.input.active": {
      "fr": "Actif",
      "en": "Active",
    },
    "app.compo.consultant.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activityType.list.table.thead.name": {
      "fr": "Nom",
    },
    "app.compo.activityType.list.table.thead.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
    },
    "app.compo.activityType.list.table.thead.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
    },
    "app.compo.activityType.list.table.thead.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
    },
    "app.compo.activityType.list.table.thead.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
    },
    "app.compo.activityType.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.activityType.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.activityType.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activityType.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.activityType.form.input.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
    },
    "app.compo.activityType.form.input.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
    },
    "app.compo.activityType.form.input.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
    },
    "app.compo.activityType.form.input.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
    },
    "app.compo.activityType.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activity.select.consultant.title": {
      "fr": "Les activit\u00e9s du consultant",
      "en": "Consultant Activities",
    },
    "app.compo.activity.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.activity.list.table.thead.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.list.table.thead.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.activity.list.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "StartDate",
    },
    "app.compo.activity.list.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "EndDate",
    },
    "app.compo.activity.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.list.table.thead.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.activity.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.activity.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.list.button.addMultiple": {
      "fr": "AJOUTER ACTIVITE MULTIPLE",
      "en": "ADD MULTI ACTIVITY",
    },
    "app.compo.activity.form.input.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.form.input.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.form.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.form.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
    },
    "app.compo.activity.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.activity.form.input.files": {
      "fr": "Fichiers",
      "en": "Files",
    },
    "app.compo.activity.form.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.form.input.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activity.multiple.table.thead.activity": {
      "fr": "Activit\u00e9",
      "en": "Activity",
    },
    "app.compo.activity.multiple.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.multiple.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.multiple.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "End Date",
    },
    "app.compo.activity.multiple.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.activity.multiple.table.actions.delete": {
      "fr": "Supprimer",
      "en": "Remove",
    },
    "app.compo.activity.multiple.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.multiple.input.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.multiple.input.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.multiple.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.multiple.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
    },
    "app.compo.activity.multiple.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.activity.multiple.input.files": {
      "fr": "Fichiers",
      "en": "Files",
    },
    "app.compo.activity.multiple.input.hourSup": {
      "fr": "Hueres suppl\u00e9mentaires",
      "en": "Hour Supplementary",
    },
    "app.compo.activity.multiple.input.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.multiple.hourSup.select.target.hour": {
      "fr": "Heure",
      "en": "Hour",
    },
    "app.compo.activity.multiple.hourSup.select.target.saturday": {
      "fr": "Samedi",
      "en": "Saturday",
    },
    "app.compo.activity.multiple.hourSup.select.target.sunday": {
      "fr": "Dimanche",
      "en": "Sunday",
    },
    "app.compo.activity.multiple.hourSup.select.target.holiday": {
      "fr": "Vacance",
      "en": "Holiday",
    },
    "app.compo.activity.multiple.hourSup.table.thead.target": {
      "fr": "But",
      "en": "Target",
    },
    "app.compo.activity.multiple.hourSup.table.thead.price": {
      "fr": "Prix",
      "en": "Price",
    },
    "app.compo.activity.multiple.hourSup.table.thead.percent": {
      "fr": "%",
      "en": "%",
    },
    "app.compo.activity.multiple.hourSup.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.activity.multiple.hourSup.table.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.multiple.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.multiple.actions.submit": {
      "fr": "SOUMETTRE",
      "en": "SUBMIT",
    },
    "app.compo.activity.multiple.modal.title": {
      "fr": "AJOUTER ACTIVITES MULTIPLES",
      "en": "ADD MULTI ACTIVITY",
    },
    "app.compo.cra.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.cra.list.table.thead.month": {
      "fr": "Mois",
      "en": "Month",
    },
    "app.compo.cra.list.table.thead.createdDate": {
      "fr": "Date Cr\u00e9ation",
      "en": "CreatedDate",
    },
    "app.compo.cra.list.table.thead.lastUpdateDate": {
      "fr": "Date Modification",
      "en": "LastUpdateDate",
    },
    "app.compo.cra.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
    },
    "app.compo.cra.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.cra.list.table.action.showDetails": {
      "fr": "Voir CRA",
      "en": "Show CRA",
    },
    // "showConge":{
    "showConge": {
      "fr": "Voir Cong\u00e9",
      "en": "Show Conge",
    },
    "showCra": {
      "fr": "Voir Cra",
      "en": "Show Cra",
    },

    "Cra": {
      "fr": "Cra",
      "en": "Cra",
    },

    "Conge": {
      "fr": "Cong\u00e9",
      "en": "Conge",
    },

    "Show": {
      "fr": "Voir",
      "en": "Show",
    },


    "app.compo.cra.list.table.action.addConge": {
      "fr": "Ajouter Cong\u00e9",
      "en": "Add Conge",
    },
    "app.compo.cra.list.table.action.addCra": {
      "fr": "Ajouter Cra",
      "en": "Add Cra",
    },
    //Note de Frais Traduction
    "app.compo.frais.form.input.title": {
      "fr": "Titre",
      "en": "Title",
    },
    "app.compo.frais.form.input.dateFee": {
      "fr": "Date Frais",
      "en": "Fee Date",
    },
    "app.compo.frais.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.frais.form.input.activity": {
      "fr": "Mission",
      "en": "Activity",
    },
    "app.compo.frais.form.input.payementMode": {
      "fr": "Mode Paiement",
      "en": "Payement Mode",
    },
    "app.compo.frais.form.input.categories": {
      "fr": "Cat\u00e9gories",
      "en": "Categories",
    },
    "app.compo.frais.form.input.invoice": {
      "fr": "D\u00e9tails Facture",
      "en": "Invoice details",
    },
    "app.compo.frais.form.input.invoiceNumber": {
      "fr": "Num\u00e9ro Facture",
      "en": "Invoice Number",
    },
    "app.compo.frais.form.input.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
    },
    "app.compo.frais.form.input.vat": {
      "fr": "TVA",
      "en": "VAT",
    },
    "app.compo.frais.form.input.amount": {
      "fr": "Montant Total",
      "en": "Amount",
    },
    "app.compo.frais.form.input.brand": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
    },
    "app.compo.frais.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.frais.form.input.feeList": {
      "fr": "List Note Frais",
      "en": "Fee List",
    },
    "app.compo.frais.list.table.thead.title": {
      "fr": "Titre",
      "en": "Title",
    },
    "app.compo.frais.list.table.thead.date": {
      "fr": "Date",
      "en": "Date",
    },
    "app.compo.frais.list.table.thead.category": {
      "fr": "Cat\u00e9gorie",
      "en": "Category",
    },
    "app.compo.frais.list.table.thead.brandName": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
    },
    "app.compo.frais.list.table.thead.vat": {
      "fr": "TVA",
      "en": "VAT",
    },
    "app.compo.frais.list.table.thead.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
    },
    "app.compo.frais.list.table.thead.amount": {
      "fr": "Montant",
      "en": "Amount",
    },
    "app.compo.frais.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
    },
    "app.compo.frais.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.frais.list.payementDate": {
      "fr": "Date Paiement",
      "en": "Payement Date",
    },
    "app.compo.frais.list.button.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.frais.list.table.thead.consultantName": {
      "fr": "Nom Consultant",
      "en": "Consultant Name",
    }
  }
}
