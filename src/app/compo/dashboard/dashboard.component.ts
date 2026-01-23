import { Component, OnInit } from '@angular/core';
import { Feature } from 'src/app/authorization/authorization.types';
import { AuthorizationService } from 'src/app/authorization/service/authorization.service';
import { Esn } from 'src/app/model/esn';
import { ClientService } from 'src/app/service/client.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { MsgService } from 'src/app/service/msg.service';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {
  sections: Array<{ title: string; route: string; feature?: Feature | null; count?: number }> = [
    { title: 'Notifications', route: '/notification' },
    { title: 'Esn', route: '/esn_app', feature: 'ESN_MANAGEMENT' },
    { title: 'Clients', route: '/client_app', feature: 'CLIENT_MANAGEMENT' },
    { title: 'Projets', route: '/project_app', feature: 'PROJECT_MANAGEMENT' },
    { title: 'Consultants', route: '/consultant_app', feature: 'CONSULTANT_MANAGEMENT' },
    { title: 'CRA', route: '/cra_app', feature: 'CRA_MANAGEMENT' },
    { title: 'Documents List', route: '/admindoc_list', feature: 'IDENTITY_DOCUMENT_MANAGEMENT' },
    // { title: 'Mon Profil', route: '/my-profile', feature: null }
  ];

  constructor(
    private authz: AuthorizationService,
    private msgService: MsgService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private consultantService: ConsultantService,
    private craService: CraService,
    private esnService: EsnService,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    // Écouter quand esnCurrent est prêt
    this.dataSharingService.esnCurrentReady$.subscribe((esn: Esn) => {
      if (esn) {
        console.log('DashboardComponent: esnCurrentReady event received, esn = ', esn);
        this.esn = esn;
        this.esnId = esn.id;
        this.loadCounts();
      }
    });
    
    // En cas où esnCurrent est déjà défini (race condition)
    if (this.dataSharingService.esnCurrent) {
      this.esn = this.dataSharingService.esnCurrent;
      this.esnId = this.esn?.id || 0;
      this.loadCounts();
    }
  }

  esn : Esn = null;
  esnId : number = 0;

  loadCounts(): void {
    // Notifications
    this.msgService.findAll().subscribe({
      next: (resp) => {
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('Notifications', count);
      },
      error: () => this.updateSectionCount('Notifications', 0)
    });

    // Esn
    this.esnService.findAll().subscribe({
      next: (resp) => {
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('Esn', count);
      },
      error: () => this.updateSectionCount('Esn', 0)
    });

    // Clients
    this.clientService.findAll(this.esnId).subscribe({
      next: (resp) => {

        console.log('DashboardComponent.loadCounts: Clients response = ', resp);
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('Clients', count);
      },
      error: () => this.updateSectionCount('Clients', 0)
    });

    // Projets
    this.projectService.findAll(this.esnId).subscribe({
      next: (resp) => {
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('Projets', count);
      },
      error: () => this.updateSectionCount('Projets', 0)
    });

    // Consultants
    this.consultantService.findAllByEsn(this.esnId).subscribe({
      next: (resp) => {
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('Consultants', count);
      },
      error: () => this.updateSectionCount('Consultants', 0)
    });

    // CRA
    this.craService.findAll().subscribe({
      next: (resp) => {
        const count = resp && resp.body && resp.body.result? resp.body.result.length : 0;
        this.updateSectionCount('CRA', count);
      },
      error: () => this.updateSectionCount('CRA', 0)
    });

    // Documents List - pas de getAll, donc compter à 0
    this.updateSectionCount('Documents List', 0);

    // Mon Profil - pas de comptage
    // this.updateSectionCount('Mon Profil', 0);
  }

  private updateSectionCount(title: string, count: number): void {
    const section = this.sections.find(s => s.title === title);
    if (section) {
      section.count = count;
    }
  }

  get visibleSections() {
    return this.sections.filter(s => {
      if (!s.feature) return true; // always visible (e.g., profile)
      return this.authz.hasPermission(s.feature, 'VIEW');
    });
  }
}
