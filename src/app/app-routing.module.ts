import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RelationsD3Component } from './compo/_utils/relations-viewer/relations-d3.component';
import { TableViewerComponent } from './compo/_utils/table-viewer/table-viewer.component';
import { ActivityAppComponent } from './compo/activity/activity-app/activity-app.component';
import { ActivityFormComponent } from './compo/activity/activity-form/activity-form.component';
import { ActivityListComponent } from './compo/activity/activity-list/activity-list.component';
import { ActivityTypeAppComponent } from './compo/activityType/activityType-app/activityType-app.component';
import { ActivityTypeFormComponent } from './compo/activityType/activityType-form/activityType-form.component';
import { ActivityTypeListComponent } from './compo/activityType/activityType-list/activityType-list.component';
import { AdminDocAppComponent } from './compo/administratifDocumentation/admin-doc-app/admin-doc-app.component';
import { AdminDocFormComponent } from './compo/administratifDocumentation/admin-doc-form/admin-doc-form.component';
import { AdminDocListComponent } from './compo/administratifDocumentation/admin-doc-list/admin-doc-list.component';
import { AdminDocMultipleComponent } from './compo/administratifDocumentation/admin-doc-multiple/admin-doc-multiple.component';
import { AdminDocPermissionComponent } from './compo/administratifDocumentation/admin-doc-permission/admin-doc-permission.component';
import { DocCategoryAppComponent } from './compo/administratifDocumentation/docCategory/doc-category-app/doc-category-app.component';
import { DocCategoryFormComponent } from './compo/administratifDocumentation/docCategory/doc-category-form/doc-category-form.component';
import { DocCategoryListComponent } from './compo/administratifDocumentation/docCategory/doc-category-list/doc-category-list.component';
import { CategoryAppComponent } from "./compo/category/category-app/category-app.component";
import { CategoryFormComponent } from "./compo/category/category-form/category-form.component";
import { CategoryListComponent } from "./compo/category/category-list/category-list.component";
import { ClientAppComponent } from './compo/client/client-app/client-app.component';
import { ClientFormComponent } from './compo/client/client-form/client-form.component';
import { ClientListComponent } from './compo/client/client-list/client-list.component';
import { CraConfigurationComponent } from "./compo/configuration/cra-configuration/cra-configuration.component";
import { ConnectionComponent } from './compo/connection/connection.component';
import { ConsultantAppComponent } from './compo/consultant/consultant-app/consultant-app.component';
import { ConsultantFormComponent } from './compo/consultant/consultant-form/consultant-form.component';
import { ConsultantListComponent } from './compo/consultant/consultant-list/consultant-list.component';
import { CraAppComponent } from './compo/cra/cra-app/cra-app.component';
import { CraFormCalComponent } from './compo/cra/cra-form/cra-form-cal.component';
import { CraListComponent } from './compo/cra/cra-list/cra-list.component';
import { DashBoardComponent } from './compo/dashboard/dashboard.component';
import { EsnAppComponent } from './compo/esn/esn-app/esn-app.component';
import { EsnFormComponent } from './compo/esn/esn-form/esn-form.component';
import { EsnListComponent } from './compo/esn/esn-list/esn-list.component';
import { InscriptionComponent } from './compo/inscription/inscription.component';
import { LoadingPageComponent } from './compo/loading-page/loading-page.component';
import { FeeDepensePercategoryDashComponent } from './compo/noteFrais/fee-depense-percategory-dash/fee-depense-percategory-dash.component';
import { FeeDepensePerconsultantDashComponent } from './compo/noteFrais/fee-depense-perconsultant-dash/fee-depense-perconsultant-dash.component';
import { FeeDepensePermonthDashComponent } from './compo/noteFrais/fee-depense-permonth-dash/fee-depense-permonth-dash.component';
import { FeeDepensePeryearDashComponent } from './compo/noteFrais/fee-depense-peryear-dash/fee-depense-peryear-dash.component';
import { NotefraisAppComponent } from "./compo/noteFrais/notefrais-app/notefrais-app.component";
import { NotefraisDashboardComponent } from './compo/noteFrais/notefrais-dashboard/notefrais-dashboard.component';
import { NotefraisFormComponent } from "./compo/noteFrais/notefrais-form/notefrais-form.component";
import { NotefraisListComponent } from "./compo/noteFrais/notefrais-list/notefrais-list.component";
import { NotificationComponent } from './compo/notification/notification.component';
import { PayementmodeAppComponent } from "./compo/payementMode/payementmode-app/payementmode-app.component";
import { PayementmodeFormComponent } from "./compo/payementMode/payementmode-form/payementmode-form.component";
import { PayementmodeListComponent } from "./compo/payementMode/payementmode-list/payementmode-list.component";
import { PermissionComponent } from "./compo/permission/permission.component";
import { ProfileComponent } from "./compo/profile/profile.component";
import { ProjectAppComponent } from './compo/project/project-app/project-app.component';
import { ProjectFormComponent } from './compo/project/project-form/project-form.component';
import { ProjectListComponent } from './compo/project/project-list/project-list.component';
import { ValidateEmailComponent } from './compo/valid-email/valid-email.component';


const routes: Routes = [
  // route publique par défaut -> rediriger vers home (dashboard)
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'validateEmail/:code', component: ValidateEmailComponent },
  { path: 'resetPassword/:code', component: ValidateEmailComponent },
  { path: 'loading', component: LoadingPageComponent },
  { path: 'connections', component: ConnectionComponent },  

  // routes protégées (après)
  { canActivate: [AuthGuard], path: 'home', component: DashBoardComponent },
  { canActivate: [AuthGuard], path: 'notification', component: NotificationComponent },

  { canActivate: [AuthGuard], path: 'my-profile', component: ProfileComponent },
  { canActivate: [AuthGuard], path: 'project_list', component: ProjectListComponent },
  { canActivate: [AuthGuard], path: 'project_form', component: ProjectFormComponent },
  { canActivate: [AuthGuard], path: 'project_app', component: ProjectAppComponent },
  { canActivate: [AuthGuard], path: 'cra_list', component: CraListComponent },
  { canActivate: [AuthGuard], path: 'cra_form', component: CraFormCalComponent },
  { canActivate: [AuthGuard], path: 'cra_app', component: CraAppComponent },
  { canActivate: [AuthGuard], path: 'consultant_list', component: ConsultantListComponent },
  { canActivate: [AuthGuard], path: 'consultant_form', component: ConsultantFormComponent },
  { canActivate: [AuthGuard], path: 'consultant_app', component: ConsultantAppComponent },
  { canActivate: [AuthGuard], path: 'client_list', component: ClientListComponent },
  { canActivate: [AuthGuard], path: 'client_form', component: ClientFormComponent },
  { canActivate: [AuthGuard], path: 'client_app', component: ClientAppComponent },
  { canActivate: [AuthGuard], path: 'esn_list', component: EsnListComponent },
  { canActivate: [AuthGuard], path: 'esn_form', component: EsnFormComponent },
  { canActivate: [AuthGuard], path: 'esn_app', component: EsnAppComponent },
  { canActivate: [AuthGuard], path: 'activity_list', component: ActivityListComponent },
  { canActivate: [AuthGuard], path: 'activity_app', component: ActivityAppComponent },
  { canActivate: [AuthGuard], path: 'activity_list', component: ActivityListComponent },
  { canActivate: [AuthGuard], path: 'activity_form', component: ActivityFormComponent },
  { canActivate: [AuthGuard], path: 'activity_app', component: ActivityAppComponent },
  { canActivate: [AuthGuard], path: 'activityType_list', component: ActivityTypeListComponent },
  { canActivate: [AuthGuard], path: 'activityType_form', component: ActivityTypeFormComponent },
  { canActivate: [AuthGuard], path: 'activityType_app', component: ActivityTypeAppComponent },
  { canActivate: [AuthGuard], path: 'permission', component: PermissionComponent },
  { canActivate: [AuthGuard], path: 'cra-configuration', component: CraConfigurationComponent },
  { canActivate: [AuthGuard], path: 'notefrais_list', component: NotefraisListComponent },
  { canActivate: [AuthGuard], path: 'notefrais_form', component: NotefraisFormComponent },
  { canActivate: [AuthGuard], path: 'notefrais_app', component: NotefraisAppComponent },
  { canActivate: [AuthGuard], path: 'category_list', component: CategoryListComponent },
  { canActivate: [AuthGuard], path: 'category_form', component: CategoryFormComponent },
  { canActivate: [AuthGuard], path: 'category_app', component: CategoryAppComponent },
  { canActivate: [AuthGuard], path: 'payementmode_list', component: PayementmodeListComponent },
  { canActivate: [AuthGuard], path: 'payementmode_form', component: PayementmodeFormComponent },
  { canActivate: [AuthGuard], path: 'payementmode_app', component: PayementmodeAppComponent },
  { canActivate: [AuthGuard], path: 'notefrais_dashboard', component: NotefraisDashboardComponent },
  { canActivate: [AuthGuard], path: 'fee_depense_permonth_dash', component: FeeDepensePermonthDashComponent },
  { canActivate: [AuthGuard], path: 'fee_depense_peryear_dash', component: FeeDepensePeryearDashComponent },
  { canActivate: [AuthGuard], path: 'fee_depense_perconsultant_dash', component: FeeDepensePerconsultantDashComponent },
  { canActivate: [AuthGuard], path: 'fee_depense_percategory_dash', component: FeeDepensePercategoryDashComponent },
  { canActivate: [AuthGuard], path: 'admindoc_app', component: AdminDocAppComponent },
  { canActivate: [AuthGuard], path: 'admindoc_form', component: AdminDocFormComponent },
  { canActivate: [AuthGuard], path: 'admindoc_list', component: AdminDocListComponent },
  { canActivate: [AuthGuard], path: 'admindoc_multiple', component: AdminDocMultipleComponent },
  { canActivate: [AuthGuard], path: 'admindoc_permission', component: AdminDocPermissionComponent },
  { canActivate: [AuthGuard], path: 'categoryDoc_app', component: DocCategoryAppComponent },
  { canActivate: [AuthGuard], path: 'categoryDoc_form', component: DocCategoryFormComponent },
  { canActivate: [AuthGuard], path: 'categoryDoc_list', component: DocCategoryListComponent },
  { canActivate: [AuthGuard], path: 'showTables', component: TableViewerComponent },
  { canActivate: [AuthGuard], path: 'connections', component: ConnectionComponent },
  { path: 'relations-d3/:table', component: RelationsD3Component },


  // { path: 'esn360/:path', component: MyRoutingSpecComponent },
  // { path: ':path', component: MyRoutingSpecComponent },  // pas de slash initial

  // { path: 'test2', component: Test2Component },

  { path: '**', component: NotificationComponent }, // toujours en dernier

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true  })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
