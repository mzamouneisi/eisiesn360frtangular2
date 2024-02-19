import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { HomeComponent } from './home/home.component';

import {AppComponent} from './app.component';
import {DpDatePickerModule} from 'ng2-date-picker';
import {AppRoutingModule} from './app-routing.module';

import {LoginComponent} from './auth/components/login/login.component';
import {IndexComponent} from './compo/_index/index.component';
import {JwtTokenInterceptor} from './auth/interceptors/jwt.token.interceptor';

import {FooterComponent} from './layout/footer/footer.component';
import {HeaderComponent} from './layout/header/header.component';

// import {DataTableModule} from 'angular-datatable';
import {MereComponent} from './compo/_utils/mere-component';
import {ProjetListComponent} from './compo/projet/projet-list/projet-list.component';
import {MenuComponent} from './compo/_menu/menu.component';
import {ProjetFormComponent} from './compo/projet/projet-form/projet-form.component';
import {ProjetAppComponent} from './compo/projet/projet-app/projet-app.component';
import {ProjetService} from './service/projet.service';
import {CraListComponent} from './compo/cra/cra-list/cra-list.component';
import {CraFormCalComponent} from './compo/cra/cra-form/cra-form-cal.component';
import {CraAppComponent} from './compo/cra/cra-app/cra-app.component';
import {CraService} from './service/cra.service';
import {CraFormsService} from './service/cra-forms.service';
import {ConsultantListComponent} from './compo/consultant/consultant-list/consultant-list.component';
import {ConsultantFormComponent} from './compo/consultant/consultant-form/consultant-form.component';
import {ConsultantAppComponent} from './compo/consultant/consultant-app/consultant-app.component';
import {ConsultantService} from './service/consultant.service';
import {ClientListComponent} from './compo/client/client-list/client-list.component';
import {ClientFormComponent} from './compo/client/client-form/client-form.component';
import {ClientAppComponent} from './compo/client/client-app/client-app.component';
import {ClientService} from './service/client.service';
import {EsnListComponent} from './compo/esn/esn-list/esn-list.component';
import {EsnFormComponent} from './compo/esn/esn-form/esn-form.component';
import {EsnAppComponent} from './compo/esn/esn-app/esn-app.component';
import {EsnService} from './service/esn.service';
import {ActivityListComponent} from './compo/activity/activity-list/activity-list.component';
import {ActivityFormComponent} from './compo/activity/activity-form/activity-form.component';
import {ActivityAppComponent} from './compo/activity/activity-app/activity-app.component';
import {ActivityService} from './service/activity.service';
import {NgbModalModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CalendarDateFormatter, CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlatpickrModule} from "angularx-flatpickr";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import {UtilsService} from "./service/utils.service";

import {ActivityTypeListComponent} from './compo/activityType/activityType-list/activityType-list.component';
import {ActivityTypeFormComponent} from './compo/activityType/activityType-form/activityType-form.component';
import {ActivityTypeAppComponent} from './compo/activityType/activityType-app/activityType-app.component';
import {ActivityTypeService} from './service/activityType.service';
import {ModalComponent} from './compo/resources/ModalComponent';
import {UserConnectedComponent} from './compo/user-connected/user-connected.component';
import {MatDialogModule} from '@angular/material/dialog';
// import {JwPaginationComponent} from "jw-angular-pagination";
import {PermissionService} from "./service/permission.service";
import {PermissionComponent} from './compo/permission/permission.component';
import {AuthorizationService} from "./authorization/service/authorization.service";
import {AuthorizationDirective} from './authorization/directive/authorization.directive';
import {DataSharingService} from "./service/data-sharing.service";
import {ProfileComponent} from './compo/profile/profile.component';
// import {NotifierModule} from "angular-notifier";
import {DatepickerModule} from "ng2-datepicker";
import {AddMultiDateComponent} from './compo/cra/add-multi-date/add-multi-date.component';
// import {MyDatePickerModule} from "mydatepicker";
import {DashboardService} from "./service/dashboard.service";
import {NoteFraisService} from "./service/note-frais.service";
import {NotefraisFormComponent} from './compo/noteFrais/notefrais-form/notefrais-form.component';
import {NotefraisAppComponent} from './compo/noteFrais/notefrais-app/notefrais-app.component';
import {NotefraisListComponent} from './compo/noteFrais/notefrais-list/notefrais-list.component';
import {CategoryService} from "./service/category.service";
import {PayementModeService} from "./service/payement-mode.service";
import {CategoryFormComponent} from './compo/category/category-form/category-form.component';
import {CategoryListComponent} from './compo/category/category-list/category-list.component';
import {CategoryAppComponent} from "./compo/category/category-app/category-app.component";
import {PayementmodeAppComponent} from './compo/payementMode/payementmode-app/payementmode-app.component';
import {PayementmodeListComponent} from './compo/payementMode/payementmode-list/payementmode-list.component';
import {PayementmodeFormComponent} from './compo/payementMode/payementmode-form/payementmode-form.component';
import {AddMultipleActivityComponent} from './compo/activity/add-multiple-activity/add-multiple-activity.component';
import {CraConfigurationComponent} from './compo/configuration/cra-configuration/cra-configuration.component';
import {CraConfigurationService} from "./service/cra-configuration.service";
import {UploadFileComponent} from './compo/upload-file/upload-file.component';

import {MsgService} from './service/msg.service';
import {MsgHistoService} from './service/msgHisto.service';
import {SelectConsultantComponent} from './compo/_reuse/select-consultant/select-consultant.component';
import {MsgNotificationsComponent} from './compo/msg-notifications/msg-notifications.component';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {forkJoin, of} from "rxjs";
import {catchError} from "rxjs/operators";
import { NotificationComponent } from './compo/notification/notification.component';
import { Test2Component } from './compo/test2/test2.component';
import { SelectComponent } from './compo/_reuse/select-consultant/select/select.component';
import { MzDatePickerComponent } from './compo/mz-date-picker/mz-date-picker.component';
import { MzDatePickerDebFinComponent } from './compo/mz-date-picker-deb-fin/mz-date-picker-deb-fin.component';
import { LoadingPageComponent } from './compo/loading-page/loading-page.component';
import { TradService } from './service/trad.service';
import { MyRoutingSpecComponent } from './compo/my-routing-spec/my-routing-spec.component';
import { MyCalendarComponent } from './compo/my-calendar/my-calendar.component';
import { SpinnerComponent } from './compo/spinner/spinner.component';
import { NotefraisDashboardComponent } from './compo/noteFrais/notefrais-dashboard/notefrais-dashboard.component';
import { NoteFraisDashboardService } from './service/note-frais-dashboard.service';
import { FeeDepensePermonthDashComponent } from './compo/noteFrais/fee-depense-permonth-dash/fee-depense-permonth-dash.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FeeDepensePeryearDashComponent } from './compo/noteFrais/fee-depense-peryear-dash/fee-depense-peryear-dash.component';
import { FeeDepensePerconsultantDashComponent } from './compo/noteFrais/fee-depense-perconsultant-dash/fee-depense-perconsultant-dash.component';
import { FeeDepensePercategoryDashComponent } from './compo/noteFrais/fee-depense-percategory-dash/fee-depense-percategory-dash.component';
import { FeeDepenseInfoDashComponent } from './compo/noteFrais/fee-depense-info-dash/fee-depense-info-dash.component';
import { AdminDocAppComponent } from './compo/administratifDocumentation/admin-doc-app/admin-doc-app.component';
import { AdminDocFormComponent } from './compo/administratifDocumentation/admin-doc-form/admin-doc-form.component';
import { AdminDocListComponent } from './compo/administratifDocumentation/admin-doc-list/admin-doc-list.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdminDocMultipleComponent } from './compo/administratifDocumentation/admin-doc-multiple/admin-doc-multiple.component';
import { AdminDocPermissionComponent } from './compo/administratifDocumentation/admin-doc-permission/admin-doc-permission.component';

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
    ProjetListComponent,
    ProjetFormComponent,
    ProjetAppComponent,
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
    HighchartsChartModule,
    NgMultiSelectDropDownModule,
  ],
  providers: [
    FormsModule,
    DatePipe,
    ProjetService,
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
    // Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    UtilsService,
    ActivityTypeService,
    PermissionService,
    AuthorizationService,
    DataSharingService,
    DashboardService,
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
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
