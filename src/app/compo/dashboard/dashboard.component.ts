import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feature } from 'src/app/authorization/authorization.types';
import { AuthorizationService } from 'src/app/authorization/service/authorization.service';
import { Activity } from 'src/app/model/activity';
import { Client } from 'src/app/model/client';
import { Consultant } from 'src/app/model/consultant';
import { Cra } from 'src/app/model/cra';
import { Esn } from 'src/app/model/esn';
import { Notification } from 'src/app/model/notification';
import { Project } from 'src/app/model/project';
import { ActivityService } from 'src/app/service/activity.service';
import { ClientService } from 'src/app/service/client.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { EsnService } from 'src/app/service/esn.service';
import { MsgService } from 'src/app/service/msg.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {
    selectedSection: any = null;
    chartData: any = null;

    sections: Array<{ title: string; route: string; feature?: Feature | null; count?: number; roles?: string[]; queryParams?: any }> = [
        { title: 'Notifications', route: '/notification' },
        { title: 'Consultants', route: '/consultant_app', feature: 'CONSULTANT_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN'] },
        { title: 'Mes Consultants', route: '/consultant_list', feature: 'CONSULTANT_MANAGEMENT', roles: ['MANAGER'], queryParams: { myConsultants: true } },
        { title: 'Esn', route: '/esn_app', feature: 'ESN_MANAGEMENT' },
        { title: 'Clients', route: '/client_app', feature: 'CLIENT_MANAGEMENT' },
        { title: 'Projets', route: '/project_app', feature: 'PROJECT_MANAGEMENT' },
        { title: 'Activités', route: '/activity_app', feature: 'ACTIVITY_MANAGEMENT' },
        { title: 'CRA', route: '/cra_app', feature: 'CRA_MANAGEMENT' },
        { title: 'Documents', route: '/admindoc_list', feature: 'IDENTITY_DOCUMENT_MANAGEMENT' },
        // { title: 'Mon Profil', route: '/my-profile', feature: null }
    ];

    listNotifications: Notification[] = [];
    listEsn: Esn[] = [];
    listClient: Client[] = [];
    listProject: Project[] = [];
    listActivity: Activity[] = [];
    listConsultant: Consultant[] = [];
    listCra: Cra[] = [];
    listDocument: Document[] = [];
    esn: Esn = null;
    esnId: number = 0;

    constructor(
        private authz: AuthorizationService,
        private msgService: MsgService,
        private clientService: ClientService,
        private projectService: ProjectService,
        private activityService: ActivityService,
        private consultantService: ConsultantService,
        private craService: CraService,
        private esnService: EsnService,
        private documentService: DocumentService,
        private dataSharingService: DataSharingService,
        private utilsIhm: UtilsIhmService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const role = this.dataSharingService.userConnected?.role;

        // Pour ADMIN, pas besoin d'attendre esnCurrentReady
        if (role === 'ADMIN') {
            this.esnId = 0; // Les ADMIN voient toutes les données sans restriction d'ESN
            this.loadCounts();
            return;
        }

        // Pour les autres rôles, écouter quand esnCurrent est prêt
        this.dataSharingService.esnCurrentReady$.subscribe((esn: Esn) => {
            if (esn) {
                console.log('DashboardComponent: esnCurrentReady event received, esn = ', esn);
                this.esn = esn;
                this.esnId = esn.id;
                if (!this.esnId) this.esnId = this.dataSharingService.userConnected?.esnId;
                console.log('DashboardComponent: esnId 1 = ', this.esnId);
                this.loadCounts();
            }
        });

        // En cas où esnCurrent est déjà défini (race condition)
        if (this.dataSharingService.esnCurrent) {
            this.esn = this.dataSharingService.esnCurrent;
            this.esnId = this.esn?.id || 0;
            if (!this.esnId) this.esnId = this.dataSharingService.userConnected?.esnId;
            console.log('DashboardComponent: esnId 2 = ', this.esnId);
            this.loadCounts();
        }
    }

    loadCounts(): void {
        const role = this.dataSharingService.userConnected?.role;

        // Notifications (pour tous les rôles)
        let idConsultant = this.dataSharingService.userConnected?.id;
        if (role === 'ADMIN') {
            idConsultant = 0; // pour admin, récupérer toutes les notifications
        }

        console.log('DashboardComponent: Loading Notifications for consultantId = ', idConsultant);
        this.dataSharingService.isCallNotifications = false // force refresh
        this.dataSharingService.getNotifications(
            (listNotif) => {
                console.log('DashboardComponent: Loaded Notif, count = ', listNotif?.length);
                const listNotifications = listNotif as Notification[];
                this.listNotifications = this.dataSharingService.getListNotifications() || listNotifications;
                this.updateSectionCount('Notifications', this.listNotifications.length);
            }, (error) => {
                console.log('DashboardComponent: Error loading Notifications', error);
                this.listNotifications = this.dataSharingService.getListNotifications() || [];
                this.updateSectionCount('Notifications', this.listNotifications.length + ' : ' + JSON.stringify(error));
            }
        );

        // ESN (pour tous les rôles)
        this.esnService.findAll().subscribe({
            next: (resp) => {
                console.log('DashboardComponent: Loaded ESNs, resp = ', resp);
                this.listEsn = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('Esn', this.listEsn.length);
            },
            error: (err) => {
                console.log('DashboardComponent: Error loading ESNs', err);
                this.updateSectionCount('Esn', 0);
            }
        });

        // CRA (pour tous les rôles)
        this.craService.findAll().subscribe({
            next: (resp) => {
                this.listCra = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('CRA', this.listCra.length);
            },
            error: () => this.updateSectionCount('CRA', 0)
        });

        // Documents (pour tous les rôles)
        this.documentService.findAllByConsultant(this.dataSharingService.userConnected?.id).subscribe({
            next: (resp) => {
                this.listDocument = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('Documents', this.listDocument.length);
            },
            error: () => this.updateSectionCount('Documents', 0)
        });

        // Consultants
        this.loadAllConsultantsAndUpdateCounts();

        // Pour ADMIN et CONSULTANT: juste les listes de base
        if (role === 'ADMIN' || role === 'CONSULTANT') {
            // Pour ADMIN, utiliser findAllAll() pour récupérer TOUS les clients sans restriction d'ESN
            const clientObservable = role === 'ADMIN'
                ? this.clientService.findAllAll()
                : this.clientService.findAll(this.esnId);

            clientObservable.subscribe({
                next: (resp) => {
                    this.listClient = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('Clients', this.listClient.length);
                },
                error: () => this.updateSectionCount('Clients', 0)
            });

            this.projectService.findAll(this.esnId).subscribe({
                next: (resp) => {
                    this.listProject = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('Projets', this.listProject.length);
                },
                error: () => this.updateSectionCount('Projets', 0)
            });

            this.activityService.findAll().subscribe({
                next: (resp) => {
                    this.listActivity = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('Activités', this.listActivity.length);
                },
                error: () => this.updateSectionCount('Activités', 0)
            });
        }

        // Pour MANAGER: vérifications hiérarchiques
        if (role === 'MANAGER') {
            this.loadClientAndCheckHierarchy();
        }
    }

    private loadClientAndCheckHierarchy(): void {
        this.clientService.findAll(this.esnId).subscribe({
            next: (resp) => {
                this.listClient = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('Clients', this.listClient.length);

                // Test 1: Si aucun client, proposer d'en créer un
                if (this.listClient.length === 0) {
                    // Afficher le message seulement si pas encore affiché
                    if (!this.dataSharingService.clientWarningShown) {
                        this.dataSharingService.clientWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun <b>CLIENT</b> n'est associé à cette ESN.<br>Veuillez ajouter un client pour pouvoir créer des projets.",
                            () => this.router.navigate(['/client_app']),
                            () => { }
                        );
                    }
                    // Toujours arrêter ici s'il n'y a pas de clients
                    return;
                }

                // Continuer avec les projets
                this.loadProjectAndCheckHierarchy();
            },
            error: () => {
                this.updateSectionCount('Clients', 0);
            }
        });
    }

    private loadProjectAndCheckHierarchy(): void {
        this.projectService.findAll(this.esnId).subscribe({
            next: (resp) => {
                this.listProject = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('Projets', this.listProject.length);

                // Test 2: Si ya au moins un client et aucun projet, proposer d'en créer un
                if (this.listProject.length === 0 && !this.dataSharingService.projectWarningShown) {
                    this.dataSharingService.projectWarningShown = true;
                    this.utilsIhm.confirmDialog(
                        "Aucun <b>PROJET</b> n'est associé à cette ESN.<br>Veuillez ajouter un projet pour pouvoir avancer.",
                        () => this.router.navigate(['/project_app']),
                        () => { }
                    );
                    return; // Stop here
                }

                // Continuer avec les consultants
                this.loadActivityAndCheckHierarchy();
            },
            error: () => {
                this.updateSectionCount('Projets', 0);
            }
        });
    }

    private loadActivityAndCheckHierarchy(): void {
        this.activityService.findAll().subscribe({
            next: (resp) => {
                this.listActivity = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('Activités', this.listActivity.length);

                // Test 3: Si ya au moins un projet et au moins un consultant de type CONSULTANT et aucune activité de type MISSION, proposer d'en créer une
                const hasConsultantRole = this.listConsultant.some(c => c.role === 'CONSULTANT');
                // Vérifier via typeName (propriété disponible) ou type.name
                const hasMissionActivity = this.listActivity.some(a =>
                    (a.typeName && a.typeName === 'MISSION') ||
                    (a.type && a.type.name === 'MISSION')
                );

                console.log('Dashboard - hasConsultantRole:', hasConsultantRole);
                console.log('Dashboard - hasMissionActivity:', hasMissionActivity);
                console.log('Dashboard - listActivity:', this.listActivity);
                console.log('Dashboard - activity types:', this.listActivity.map(a => ({ typeName: a.typeName, type: a.type })));

                if (this.listProject.length > 0 && hasConsultantRole && !hasMissionActivity && !this.dataSharingService.missionActivityWarningShown) {
                    this.dataSharingService.missionActivityWarningShown = true;
                    this.utilsIhm.confirmDialog(
                        "Aucune <b>ACTIVITÉ de type MISSION</b> n'est enregistrée.<br>Veuillez ajouter une activité de type MISSION pour permettre aux consultants de saisir leurs CRA.",
                        () => this.router.navigate(['/activity_app']),
                        () => { }
                    );
                }
            },
            error: () => {
                this.updateSectionCount('Activités', 0);
            }
        });
    }

    private loadAllConsultantsAndUpdateCounts(): void {
        const user = this.dataSharingService.userConnected;
        const role = user?.role;

        if (!user) {
            this.updateSectionCount('Consultants', 0);
            this.updateSectionCount('Mes Consultants', 0);
            return;
        }

        // Load all consultants for ADMIN
        if (role === 'ADMIN') {
            this.consultantService.findAll().subscribe({
                next: (resp) => {
                    this.listConsultant = resp?.body?.result || [];
                    this.updateSectionCount('Consultants', this.listConsultant.length);
                },
                error: () => this.updateSectionCount('Consultants', 0)
            });
            return;
        }

        // Load ESN consultants for RESPONSIBLE_ESN
        if (role === 'RESPONSIBLE_ESN') {
            this.consultantService.findAllByEsn(this.esnId).subscribe({
                next: (resp) => {
                    this.listConsultant = resp?.body?.result || [];
                    this.updateSectionCount('Consultants', this.listConsultant.length);

                    // Test: si listConsultant ne contient pas un manager, afficher dialog
                    let hasManager = this.listConsultant.some(c => c.role === 'MANAGER');
                    if (!hasManager && !this.dataSharingService.managerWarningShown) {
                        this.dataSharingService.managerWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun consultant de rôle MANAGER n'est associé à cette ESN. Veuillez ajouter un consultant avec le rôle MANAGER pour une gestion optimale.",
                            () => this.router.navigate(['/consultant_app']),
                            () => { }
                        );
                    }
                },
                error: () => this.updateSectionCount('Consultants', 0)
            });
            return;
        }

        // Load ESN consultants once for MANAGER
        if (role === 'MANAGER') {
            const esnId = user?.esn?.id || user?.esnId;
            this.consultantService.findAllByEsn(esnId).subscribe({
                next: (resp) => {
                    const allConsultants = resp?.body?.result || [];
                    this.listConsultant = allConsultants;
                    // Mes Consultants: filter by adminConsultantId = userConnected.id, include manager himself
                    const myConsultants = allConsultants.filter(c => c.adminConsultantId === user.id || c.id === user.id);
                    this.updateSectionCount('Consultants', this.listConsultant.length);
                    this.updateSectionCount('Mes Consultants', myConsultants.length);

                    // Test hiérarchique dans loadClientAndCheckHierarchy: vérifier si consultant CONSULTANT existe
                    if (!this.listConsultant.some(c => c.role === 'CONSULTANT') &&
                        !this.dataSharingService.consultantWarningShown &&
                        this.listProject.length > 0) {
                        this.dataSharingService.consultantWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun <b>CONSULTANT</b> de rôle CONSULTANT n'est associé à cette ESN. Veuillez ajouter un consultant avec le rôle CONSULTANT pour une gestion optimale des activités.",
                            () => this.router.navigate(['/consultant_app']),
                            () => { }
                        );
                    }
                },
                error: () => {
                    this.updateSectionCount('Consultants', 0);
                    this.updateSectionCount('Mes Consultants', 0);
                }
            });
            return;
        }

        // Default fallback: consultants of current ESN
        this.consultantService.findAllByEsn(this.esnId).subscribe({
            next: (resp) => {
                this.listConsultant = resp?.body?.result || [];
                this.updateSectionCount('Consultants', this.listConsultant.length);
                this.updateSectionCount('Mes Consultants', 0);
            },
            error: () => {
                this.updateSectionCount('Consultants', 0);
                this.updateSectionCount('Mes Consultants', 0);
            }
        });
    }

    private updateSectionCount(title: string, count: any): void {
        const section = this.sections.find(s => s.title === title);
        if (section) {
            section.count = count;
        }
    }

    get visibleSections() {
        const role = this.dataSharingService.userConnected?.role;
        return this.sections.filter(s => {
            if (s.roles && (!role || !s.roles.includes(role))) return false;
            if (!s.feature) return true; // always visible (e.g., profile)
            return this.authz.hasPermission(s.feature, 'VIEW');
        });
    }

    showChart(section: any): void {
        this.selectedSection = section;
        this.chartData = this.generateChartData(section.title);
    }

    closeChart(): void {
        this.selectedSection = null;
        this.chartData = null;
    }

    /**
     * Génère les données du graphique basées sur la propriété createdDate
     */
    private generateChartData(sectionTitle: string): any {
        let dataList: any[] = [];
        
        // Récupérer les données correspondantes à la section
        switch(sectionTitle) {
            case 'Notifications':
                dataList = this.listNotifications;
                break;
            case 'Consultants':
            case 'Mes Consultants':
                dataList = this.listConsultant;
                break;
            case 'Esn':
                dataList = this.listEsn;
                break;
            case 'Clients':
                dataList = this.listClient;
                break;
            case 'Projets':
                dataList = this.listProject;
                break;
            case 'Activités':
                dataList = this.listActivity;
                break;
            case 'CRA':
                dataList = this.listCra;
                break;
            case 'Documents':
                dataList = this.listDocument;
                break;
            default:
                dataList = [];
        }

        // Grouper par date de création
        const dateGroups = this.groupByCreatedDate(dataList);
        
        // Convertir en format de graphique avec dates et counts cumulés
        const chartData = this.convertToChartFormat(dateGroups);
        
        return chartData;
    }

    /**
     * Groupe les données par date de création
     */
    private groupByCreatedDate(dataList: any[]): Map<string, number> {
        const groups = new Map<string, number>();
        
        dataList.forEach(item => {
            if (item.createdDate) {
                const date = new Date(item.createdDate);
                const dateKey = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
                groups.set(dateKey, (groups.get(dateKey) || 0) + 1);
            }
        });
        
        return groups;
    }

    /**
     * Convertit les groupes de dates en format de graphique avec cumul
     */
    private convertToChartFormat(dateGroups: Map<string, number>): any {
        // Trier les dates
        const sortedDates = Array.from(dateGroups.keys()).sort();
        
        const labels: string[] = [];
        const data: number[] = [];
        const cumulativeData: number[] = [];
        let cumulative = 0;
        
        sortedDates.forEach(date => {
            const count = dateGroups.get(date) || 0;
            cumulative += count;
            
            labels.push(this.formatDate(date));
            data.push(count);
            cumulativeData.push(cumulative);
        });
        
        return {
            labels: labels,
            dailyCount: data,
            cumulativeCount: cumulativeData,
            totalDays: labels.length,
            currentTotal: cumulative
        };
    }

    /**
     * Formate une date pour l'affichage
     */
    private formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}
