import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { HomeComponent } from './home/home.component';

import { DpDatePickerModule } from 'ng2-date-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './auth/components/login/login.component';
import { JwtTokenInterceptor } from './auth/interceptors/jwt.token.interceptor';
import { IndexComponent } from './compo/_index/index.component';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

// import {DataTableModule} from 'angular-datatable';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FlatpickrModule } from "angularx-flatpickr";
import { MenuComponent } from './compo/_menu/menu.component';
import { MereComponent } from './compo/_utils/mere-component';
import { ActivityAppComponent } from './compo/activity/activity-app/activity-app.component';
import { ActivityFormComponent } from './compo/activity/activity-form/activity-form.component';
import { ActivityListComponent } from './compo/activity/activity-list/activity-list.component';
import { ClientAppComponent } from './compo/client/client-app/client-app.component';
import { ClientFormComponent } from './compo/client/client-form/client-form.component';
import { ClientListComponent } from './compo/client/client-list/client-list.component';
import { ConsultantAppComponent } from './compo/consultant/consultant-app/consultant-app.component';
import { ConsultantFormComponent } from './compo/consultant/consultant-form/consultant-form.component';
import { ConsultantListComponent } from './compo/consultant/consultant-list/consultant-list.component';
import { CraAppComponent } from './compo/cra/cra-app/cra-app.component';
import { CraFormCalComponent } from './compo/cra/cra-form/cra-form-cal.component';
import { CraListComponent } from './compo/cra/cra-list/cra-list.component';
import { EsnAppComponent } from './compo/esn/esn-app/esn-app.component';
import { EsnFormComponent } from './compo/esn/esn-form/esn-form.component';
import { EsnListComponent } from './compo/esn/esn-list/esn-list.component';
import { ActivityService } from './service/activity.service';
import { ClientService } from './service/client.service';
import { ConsultantService } from './service/consultant.service';
import { CraFormsService } from './service/cra-forms.service';
import { CraService } from './service/cra.service';
import { EsnService } from './service/esn.service';

import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UtilsService } from "./service/utils.service";

import { MatDialogModule } from '@angular/material/dialog';
import { ActivityTypeAppComponent } from './compo/activityType/activityType-app/activityType-app.component';
import { ActivityTypeFormComponent } from './compo/activityType/activityType-form/activityType-form.component';
import { ActivityTypeListComponent } from './compo/activityType/activityType-list/activityType-list.component';
import { ModalComponent } from './compo/resources/ModalComponent';
import { UserConnectedComponent } from './compo/user-connected/user-connected.component';
import { ActivityTypeService } from './service/activityType.service';
// import {JwPaginationComponent} from "jw-angular-pagination";
import { AuthorizationDirective } from './authorization/directive/authorization.directive';
import { AuthorizationService } from "./authorization/service/authorization.service";
import { PermissionComponent } from './compo/permission/permission.component';
import { ProfileComponent } from './compo/profile/profile.component';
import { DataSharingService } from "./service/data-sharing.service";
import { PermissionService } from "./service/permission.service";
// import {NotifierModule} from "angular-notifier";
import { DatepickerModule } from "ng2-datepicker";
import { AddMultiDateComponent } from './compo/cra/add-multi-date/add-multi-date.component';
// import {MyDatePickerModule} from "mydatepicker";
import { AddMultipleActivityComponent } from './compo/activity/add-multiple-activity/add-multiple-activity.component';
import { CategoryAppComponent } from "./compo/category/category-app/category-app.component";
import { CategoryFormComponent } from './compo/category/category-form/category-form.component';
import { CategoryListComponent } from './compo/category/category-list/category-list.component';
import { CraConfigurationComponent } from './compo/configuration/cra-configuration/cra-configuration.component';
import { NotefraisAppComponent } from './compo/noteFrais/notefrais-app/notefrais-app.component';
import { NotefraisFormComponent } from './compo/noteFrais/notefrais-form/notefrais-form.component';
import { NotefraisListComponent } from './compo/noteFrais/notefrais-list/notefrais-list.component';
import { PayementmodeAppComponent } from './compo/payementMode/payementmode-app/payementmode-app.component';
import { PayementmodeFormComponent } from './compo/payementMode/payementmode-form/payementmode-form.component';
import { PayementmodeListComponent } from './compo/payementMode/payementmode-list/payementmode-list.component';
import { UploadFileComponent } from './compo/upload-file/upload-file.component';
import { CategoryService } from "./service/category.service";
import { CraConfigurationService } from "./service/cra-configuration.service";

import { NoteFraisService } from "./service/note-frais.service";
import { PayementModeService } from "./service/payement-mode.service";

import { MatTreeModule } from '@angular/material/tree';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { HighchartsChartModule } from 'highcharts-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { SelectConsultantComponent } from './compo/_reuse/select-consultant/select-consultant.component';
import { SelectComponent } from './compo/_reuse/select-consultant/select/select.component';
import { AdminDocAppComponent } from './compo/administratifDocumentation/admin-doc-app/admin-doc-app.component';
import { AdminDocFormComponent } from './compo/administratifDocumentation/admin-doc-form/admin-doc-form.component';
import { AdminDocListComponent } from './compo/administratifDocumentation/admin-doc-list/admin-doc-list.component';
import { AdminDocMultipleComponent } from './compo/administratifDocumentation/admin-doc-multiple/admin-doc-multiple.component';
import { AdminDocPermissionComponent } from './compo/administratifDocumentation/admin-doc-permission/admin-doc-permission.component';
import { LoadingPageComponent } from './compo/loading-page/loading-page.component';
import { MsgNotificationsComponent } from './compo/msg-notifications/msg-notifications.component';
import { MyCalendarComponent } from './compo/my-calendar/my-calendar.component';
import { MyRoutingSpecComponent } from './compo/my-routing-spec/my-routing-spec.component';
import { MzDatePickerDebFinComponent } from './compo/mz-date-picker-deb-fin/mz-date-picker-deb-fin.component';
import { MzDatePickerComponent } from './compo/mz-date-picker/mz-date-picker.component';
import { FeeDepenseInfoDashComponent } from './compo/noteFrais/fee-depense-info-dash/fee-depense-info-dash.component';
import { FeeDepensePercategoryDashComponent } from './compo/noteFrais/fee-depense-percategory-dash/fee-depense-percategory-dash.component';
import { FeeDepensePerconsultantDashComponent } from './compo/noteFrais/fee-depense-perconsultant-dash/fee-depense-perconsultant-dash.component';
import { FeeDepensePermonthDashComponent } from './compo/noteFrais/fee-depense-permonth-dash/fee-depense-permonth-dash.component';
import { FeeDepensePeryearDashComponent } from './compo/noteFrais/fee-depense-peryear-dash/fee-depense-peryear-dash.component';
import { NotefraisDashboardComponent } from './compo/noteFrais/notefrais-dashboard/notefrais-dashboard.component';
import { NotificationComponent } from './compo/notification/notification.component';
import { SpinnerComponent } from './compo/spinner/spinner.component';
import { Test2Component } from './compo/test2/test2.component';
import { MsgService } from './service/msg.service';
import { MsgHistoService } from './service/msgHisto.service';
import { NoteFraisDashboardService } from './service/note-frais-dashboard.service';
import { TradService } from './service/trad.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConsultantArboComponent } from './compo/consultant/consultant-arbo/consultant-arbo.component';

import { MatTabsModule } from '@angular/material/tabs';
import { ClientsDialogComponent } from './compo/_dialogs/ClientsDialogComponent';
import { ConfirmDialogComponent } from './compo/_dialogs/confirm-dialog.component';
import { CraHistoStatusComponent } from './compo/_dialogs/CraHistoStatusComponent';
import { InfoDialogComponent } from './compo/_dialogs/info-dialog.component';
import { SignupDialogComponent } from './compo/_dialogs/signup-dialog/signup-dialog.component';
import { RelationsD3Component } from './compo/_utils/relations-viewer/relations-d3.component';
import { TableViewerComponent } from './compo/_utils/table-viewer/table-viewer.component';
import { DocCategoryAppComponent } from './compo/administratifDocumentation/docCategory/doc-category-app/doc-category-app.component'; // Assurez-vous d'importer MatTabsModule
import { DocCategoryFormComponent } from './compo/administratifDocumentation/docCategory/doc-category-form/doc-category-form.component';
import { DocCategoryListComponent } from './compo/administratifDocumentation/docCategory/doc-category-list/doc-category-list.component';
import { ConnectionComponent } from './compo/connection/connection.component';
import { DashBoardComponent } from './compo/dashboard/dashboard.component';
import { EsnArboComponent } from './compo/esn/esn-arbo/esn-arbo.component';
import { InscriptionComponent } from './compo/inscription/inscription.component';
import { LoadingDialogComponent } from './compo/loading-dialog/loading-dialog.component';
import { ProjectAppComponent } from './compo/project/project-app/project-app.component';
import { ProjectFormComponent } from './compo/project/project-form/project-form.component';
import { ProjectListComponent } from './compo/project/project-list/project-list.component';
import { ValidateEmailComponent } from './compo/valid-email/valid-email.component';
import { ProjectService } from './service/project.service';
// import { TabsComponent } from './tabs/tabs.component';


export function initApp(http: HttpClient, translate: TranslateService) {
  return () => new Promise<boolean>((resolve: (res: boolean) => void) => {

    const defaultLocale = UtilsService.DEFAULT_LOCALE
    const translationsUrl = '/assets/i18n/translations';
    const suffix = '.json';
    const storageLocale = localStorage.getItem('locale');
    const locale = storageLocale || defaultLocale;

    forkJoin([
      http.get(`/assets/i18n/dev.json`).pipe(
        catchError(() => of(null))
      ),
      http.get(`${translationsUrl}/${locale}${suffix}`).pipe(
        catchError(() => of(null))
      )
    ]).subscribe((response: any[]) => {
      const devKeys = response[0];
      const translatedKeys = response[1];

      translate.setTranslation(defaultLocale, devKeys || {});
      translate.setTranslation(locale, translatedKeys || {}, true);

      translate.setDefaultLang(defaultLocale);
      translate.use(locale);

      resolve(true);
    });
  });
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SelectComponent,
    MereComponent,
    MenuComponent,
    LoginComponent,
    IndexComponent,
    FooterComponent,
    HeaderComponent,
    ModalComponent,
    ProjectListComponent,
    ProjectFormComponent,
    ProjectAppComponent,
    CraListComponent,
    CraFormCalComponent,
    CraAppComponent,
    ConsultantListComponent,
    ConsultantFormComponent,
    ConsultantAppComponent,
    ClientListComponent,
    ClientFormComponent,
    ClientAppComponent,
    EsnListComponent,
    EsnFormComponent,
    EsnAppComponent,
    ActivityListComponent,
    ActivityFormComponent,
    ActivityAppComponent,
    ActivityTypeListComponent,
    ActivityTypeFormComponent,
    ActivityTypeAppComponent,
    UserConnectedComponent,
    // JwPaginationComponent,
    PermissionComponent,
    AuthorizationDirective,
    ProfileComponent,
    AddMultiDateComponent,
    NotefraisFormComponent,
    NotefraisAppComponent,
    NotefraisListComponent,
    CategoryAppComponent,
    CategoryFormComponent,
    CategoryListComponent,
    PayementmodeAppComponent,
    PayementmodeListComponent,
    PayementmodeFormComponent,
    AddMultipleActivityComponent,
    CraConfigurationComponent,
    UploadFileComponent,
    SelectConsultantComponent,
    MsgNotificationsComponent,
    NotificationComponent,
    DashBoardComponent,
    Test2Component,
    MzDatePickerComponent,
    MzDatePickerDebFinComponent,
    LoadingPageComponent,
    MyRoutingSpecComponent,
    MyCalendarComponent,
    SpinnerComponent,
    NotefraisDashboardComponent,
    FeeDepensePermonthDashComponent,
    FeeDepensePeryearDashComponent,
    FeeDepensePerconsultantDashComponent,
    FeeDepensePercategoryDashComponent,
    FeeDepenseInfoDashComponent,
    AdminDocAppComponent,
    AdminDocFormComponent,
    AdminDocListComponent,
    AdminDocMultipleComponent,
    AdminDocPermissionComponent,
    ConsultantArboComponent,
    EsnArboComponent,
    DocCategoryFormComponent,
    DocCategoryListComponent,
    DocCategoryAppComponent,
    TableViewerComponent,
    ConnectionComponent,
    ClientsDialogComponent,
    SignupDialogComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    InscriptionComponent,
    ValidateEmailComponent,
    CraHistoStatusComponent,
    RelationsD3Component,
    LoadingDialogComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: adapterFactory
      }
    ),
    TranslateModule.forRoot(),
    DpDatePickerModule,
    DatepickerModule,
    MatDialogModule,
    // NotifierModule,
    // NotificationComponent
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgMultiSelectDropDownModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    FormsModule,
    DatePipe,
    ProjectService,
    CraService,
    ConsultantService,
    ClientService,
    EsnService,
    CraFormsService,
    ActivityService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true
    },
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy  },
    UtilsService,
    ActivityTypeService,
    PermissionService,
    AuthorizationService,
    DataSharingService,
    NoteFraisService,
    CategoryService,
    PayementModeService,
    CraConfigurationService,
    MsgService,
    MsgHistoService,
    TradService,
    NoteFraisDashboardService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initApp,
    //   deps: [HttpClient, TranslateService],
    //   multi: true
    // },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor(private dateAdapter: DateAdapter<Date>) {
  //   this.dateAdapter.setLocale('fr-FR'); // force le datepicker à travailler en local
  // }
}
