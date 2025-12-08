import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';
import { TableService } from 'src/app/service/table.service';

// Interface pour les relations de la base de données (après mapping côté service)
interface Relation {
  table: string; // Source table name
  column: string;
  target_table: string; // Target table name
  target_pk: string;
}

// Constantes pour la taille des nœuds (Tables)
const NODE_WIDTH = 120;
const NODE_HEIGHT = 50;

@Component({
  selector: 'app-relations-d3',
  templateUrl: './relations-d3.component.html',
  styleUrls: ['./relations-d3.component.css']
})
export class RelationsD3Component implements OnInit, OnDestroy, OnChanges {

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltipRef!: ElementRef;

  private svg: any;
  private width = 1200;
  private height = 800;
  private simulation: any;
  private zoomG: any;
  private linkGroup: any;
  private nodeGroup: any;
  private zoomBehavior: any;

  @Input() focusedTable: string | null = null;
  tooltipVisible = false;

  @Input() data: any;
  // @Input() selectedTable: string;
  // Propriété pour l'isolation du graphe (via dblclick)
  isolatedTable: string | null = null;

  // identifiant unique pour marker (évite collisions si plusieurs SVG)
  private arrowMarkerId = 'arrow-' + Math.floor(Math.random() * 1000000);

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService
  ) { }

  //   private initializeOnce() {
  //   // create svg only once
  //   if (!this.chartContainer) return;
  //   this.createSvg();
  //   this.fetchRelationsAndRender();

  //   if ('ResizeObserver' in window) {
  //     this.resizeObserver = new ResizeObserver(() => this.onResize());
  //     this.resizeObserver.observe(this.chartContainer.nativeElement);
  //   }
  // }

  ngOnInit(): void {
    // this.focusedTable = this.selectedTable || this.route.snapshot.paramMap.get('table');
    // this.createSvg();
    // this.fetchRelationsAndRender();
    window.addEventListener('resize', this.onResize);
  }

  ngAfterViewInit() {
    // // attendre un tick pour être sûr que le DOM + CSS sont appliqués
    // requestAnimationFrame(() => {
    //   this.createSvg();
    //   this.fetchRelationsAndRender();
    // });

    requestAnimationFrame(() => {
      this.createSvg();
      this.fetchRelationsAndRender();
      // ResizeObserver
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.chartContainer.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    // window.removeEventListener('resize', this.onResize);
    // if (this.simulation) this.simulation.stop();

    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.onResize);
    if (this.simulation) this.simulation.stop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focusedTable'] && !changes['focusedTable'].firstChange) {
      // this.focusedTable = this.selectedTable;
      // this.isolatedTable = null;
      this.isolatedTable = this.focusedTable

      const relations = this.tableService.relationsData;
      if (relations && Array.isArray(relations)) {
        const targetId = this.focusedTable;
        let dataToRender;

        if (targetId) {
          dataToRender = this.filterGraph(relations, targetId);
        } else {
          dataToRender = this.buildGraph(relations);
        }

        setTimeout(() => {
          console.log("ngOnChanges : Av call render : dataToRender : ", dataToRender, "targetId : ", targetId)
          this.render(dataToRender.nodes, dataToRender.links);
        }, 500);
      }
    }
  }

  private onResize = () => {
    const container = this.chartContainer.nativeElement as HTMLElement;
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    if (this.svg) {
      this.svg.attr('width', this.width).attr('height', this.height);
      this.fit();
    }
  }

  private createSvg() {
    const container = this.chartContainer.nativeElement as HTMLElement;
    const rect = container.getBoundingClientRect();
    this.width = rect.width || this.width;
    this.height = rect.height || this.height;

    // si width/height sont à 0, retenter (protection pour build prod)
    if (!rect.width || !rect.height) {
      // on retente juste après le rendu
      setTimeout(() => {
        const r2 = container.getBoundingClientRect();
        this.width = r2.width || this.width;
        this.height = r2.height || this.height;
        this.createSvg(); // attention : si tu fais récursif, protège-toi d'une boucle infinie
      }, 50);
      return;
    }

    // clear container
    container.innerHTML = '';

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('cursor', 'move');

    // group for zoom/pan
    this.zoomG = this.svg.append('g');

    // layers
    this.linkGroup = this.zoomG.append('g').attr('class', 'links');
    this.nodeGroup = this.zoomG.append('g').attr('class', 'nodes');

    // zoom behaviour
    this.zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event: any) => {
        this.zoomG.attr('transform', event.transform);
      });

    this.svg.call(this.zoomBehavior as any);
  }

  private fetchRelationsAndRender() {
    let fct ="fetchRelationsAndRender"
    // Récupération via service (le service doit remplir tableService.relationsData)
    const relations = this.tableService.relationsData;
    const dataExists = relations && Array.isArray(relations) && relations.length > 0;

    console.log(fct + " : relations : ", relations, ", dataExists : ", dataExists)

    if (!dataExists) {
      this.tableService.openRelations(
        (res: any[]) => {
          console.log(fct + " : res : ", res)
          // le service doit avoir mis à jour relationsData ; on accepte res aussi
          const currentRelations = (res && Array.isArray(res) && res.length > 0) ? res : (this.tableService.relationsData || []);
          console.log(fct + " : currentRelations : ", currentRelations)

          // Supporte backend qui renvoie majuscules: map automatique
          // const mapped = this.mapRelationsKeys(currentRelations);

          // const targetId = this.isolatedTable || this.selectedTable || this.focusedTable;
          const targetId = this.isolatedTable || null;
          console.log(fct + " : targetId : ", targetId)

          // const dataToRender = targetId ? this.filterGraph(mapped, targetId) : this.buildGraph(mapped);
          // this.render(dataToRender.nodes, dataToRender.links);
          let dataToRender;
          if (targetId) {
            dataToRender = this.filterGraph(currentRelations, targetId);
          } else {
            dataToRender = this.buildGraph(currentRelations); // <-- TOUTES LES TABLES
          }

          console.log(fct + " : Av call render : dataToRender : ", dataToRender, "targetId : ", targetId)
          this.render(dataToRender.nodes, dataToRender.links);

        },
        (err: any) => {
          console.error(fct + ' Erreur récupération relations', err);
          // même si erreur, tenter d'afficher ce qu'on a
          const fallback = this.tableService.relationsData || [];
          const mapped = this.mapRelationsKeys(fallback);
          const dataToRender = this.buildGraph(mapped);

          this.render(dataToRender.nodes, dataToRender.links);
        }
      );
    } else {
      const mapped = this.mapRelationsKeys(relations);
      const targetId = this.isolatedTable || this.focusedTable;
      const dataToRender = targetId ? this.filterGraph(mapped, targetId) : this.buildGraph(mapped);

      console.log(fct + " : else : Av call render : dataToRender : ", dataToRender, "targetId : ", targetId)
      this.render(dataToRender.nodes, dataToRender.links);
    }
  }

  // Mappe automatiquement les clés venant du backend (TABLE_NAME / table_name / TABLE / table)
  private mapRelationsKeys(raw: any[]): Relation[] {
    if (!Array.isArray(raw)) return [];
    return raw.map(r => {
      // récupération robuste des champs
      const table = r.table || r.TABLE_NAME || r.TABLE || r.table_name || r.Table || '';
      const column = r.column || r.COLUMN_NAME || r.COLUMN || r.column_name || '';
      const target_table = r.target_table || r.TARGET_TABLE || r.TARGET || r.target_table || r.Target || '';
      const target_pk = r.target_pk || r.TARGET_PK || r.TARGETPK || r.target_pk || r.TargetPk || '';
      return { table, column, target_table, target_pk };
    }).filter(x => x.table && x.target_table);
  }

  /**
   * Construire nodes & links D3 à partir des relations
   */
  private buildGraph(relations: Relation[]) {
    let fct ="buildGraph"
    console.log(fct + " : relations : ", relations)
    if (!Array.isArray(relations)) {
      console.warn(fct + " : Relations data is not an array, returning empty graph.");
      return { nodes: [], links: [] };
    }

    const nodeMap: Map<string, any> = new Map();
    const links: any[] = [];

    relations.forEach(r => {
      console.log(fct + " : r : ", r)
      const src = r.table;
      const tgt = r.target_table;

      if (!nodeMap.has(src)) nodeMap.set(src, { id: src, tables: [src], columns: [] });
      if (!nodeMap.has(tgt)) nodeMap.set(tgt, { id: tgt, tables: [tgt], columns: [] });

      console.log(fct + " : nodeMap : ", nodeMap)

      // link: source -> target
      let link = {
        source: src,
        target: tgt,
        table: r.table,
        target_table: r.target_table,
        column: r.column,
        target_pk: r.target_pk,
        type: 'fk'
      }
      console.log(fct + " : push link : ", link)
      links.push(link);
    });

    const nodes = Array.from(nodeMap.values());
    console.log(fct + " : nodes : ", nodes , ", links : ", links )
    return { nodes, links };
  }

  private render(nodes: any[], links: any[]) {

    let fct = "render"

    console.log(fct + ' nodes:', nodes.length, 'links:', links.length);

    // Si la liste des nœuds est vide, on ne fait rien
    if (!nodes || nodes.length === 0) {
      console.log(fct + ' END')
      this.linkGroup.selectAll('*').remove();
      this.nodeGroup.selectAll('*').remove();
      if (this.simulation) this.simulation.stop();
      return;
    }

    const targetId = this.isolatedTable || null;
    console.log(fct + ' targetId : ', targetId)

    const centerX = this.width / 2;
    const centerY = this.height * 0.1;

    // NOUVELLE position du nœud focus (aligné à gauche)
    // Utilisons par exemple 10% de la largeur pour la position X initiale/fixe
    const centerX_Fixed = this.width * 0.1;
    const centerY_Fixed = this.height * 0.1;

    // NOUVEAU centre pour la simulation
    // Utilisons par exemple 10% de la largeur pour attirer le graphe à gauche
    const forceCenterX = this.width * 0.1;
    // const forceCenterY = this.height / 2;
    const forceCenterY = this.height * 0.1;

    // Initial positions / fixed for focused node
    nodes.forEach((d: any) => {
      if (d.id === targetId && targetId !== null) {
        d.fx = centerX_Fixed; // Utilisation de la nouvelle position X à gauche
        d.fy = centerY_Fixed;
        d.isFixed = true;
      } else {
        d.fx = null;
        d.fy = null;
      }

    });

    // clear previous
    this.linkGroup.selectAll('*').remove();
    this.nodeGroup.selectAll('*').remove();

    // stop previous simulation
    if (this.simulation) {
      try { this.simulation.stop(); } catch (e) { /* ignore */ }
    }

    // Force simulation
    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(180).strength(1))
      .force('charge', d3.forceManyBody().strength(-600))
      // CHANGEMENT ICI : Déplacement du centre vers la gauche (30% de la largeur)
      .force('center', d3.forceCenter(forceCenterX, forceCenterY))
      .force('collide', d3.forceCollide().radius(Math.max(NODE_WIDTH, NODE_HEIGHT)));

    // ### Définir marker (une seule fois par svg, ici on recrée proprement)
    // Supprimer d'éventuels defs précédents
    this.svg.select('defs').remove();
    const defs = this.svg.append('defs');
    defs.append('marker')
      .attr('id', this.arrowMarkerId)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', NODE_WIDTH / 2 + 6) // place le marker à l'extérieur du rectangle
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      // .attr('fill', '#666');
      .attr('fill', 'currentColor');

    // links: path
    const link = this.linkGroup.selectAll('path')
      .data(links, (d: any) => `${d.source}->${d.target}`)
      .enter()
      .append('path')
      .attr('class', (d: any) => 'link ' + (d.type === 'fk' ? 'fk' : ''))
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', 1.6)
      .attr('marker-end', `url(#${this.arrowMarkerId})`);

    // nodes group
    const node = this.nodeGroup.selectAll('.node')
      .data(nodes, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event: any, d: any) => this.dragStarted(event, d))
        .on('drag', (event: any, d: any) => this.dragged(event, d))
        .on('end', (event: any, d: any) => this.dragEnded(event, d))
      );

    // rectangle pour la table
    node.append('rect')
      .attr('x', -NODE_WIDTH / 2)
      .attr('y', -NODE_HEIGHT / 2)
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', (d: any) => d.id === this.focusedTable ? '#ffdca6' : '#e6f2ff')
      .attr('stroke', '#2b7cff')
      .attr('stroke-width', 1.2);

    // nom de la table (texte centré)
    node.append('text')
      .text((d: any) => this.truncate(d.id, 18))
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('fill', '#033')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    // interactions
    // const this = this;

    node.on('dblclick', (event: any, d: any) => {
      console.log("dblclick node : ", node)
      console.log("dblclick d : ", d)
      console.log("dblclick isolatedTable : ", this.isolatedTable)

      if (this.isolatedTable === d.id) {
        this.isolatedTable = null;
      } else {
        this.isolatedTable = d.id;
      }

      const relationsData = this.tableService.relationsData || [];
      const targetIdToFilter = this.isolatedTable;

      let dataToRender;
      if (targetIdToFilter) {
        dataToRender = this.filterGraph(relationsData, targetIdToFilter);
      } else {
        dataToRender = this.buildGraph(relationsData);
      }

      console.log("Av call render : dataToRender : ", dataToRender, "targetIdToFilter : ", targetIdToFilter)

      this.render(dataToRender.nodes, dataToRender.links);
    });


    node.on('mouseover', (event: any, d: any) => {
      this.showTooltip(event, `Table: ${d.id}`);
      d3.select(event.currentTarget).select('rect').attr('stroke-width', 2.4);
    });

    node.on('mouseout', (event: any, d: any) => {
      this.hideTooltip();
      d3.select(event.currentTarget).select('rect').attr('stroke-width', 1.2);
    });

    link.on('mouseover', (event: any, d: any) => {
      const s = typeof d.source === 'object' ? d.source.id : d.source;
      const t = typeof d.target === 'object' ? d.target.id : d.target;
      this.showTooltip(event, `${s}.${d.column || ''} → ${t}.${d.target_pk || ''}`);
      d3.select(event.currentTarget).attr('stroke-width', 2.6).attr('stroke', '#d9534f').attr('stroke-opacity', 1);
    });

    link.on('mouseout', (event: any) => {
      this.hideTooltip();
      d3.select(event.currentTarget).attr('stroke-width', 1.6).attr('stroke', '#999').attr('stroke-opacity', 0.8);
    });

    // tick
    this.simulation.on('tick', () => {
      const resolveNode = (d: any) => (typeof d === 'object') ? d : nodes.find(n => n.id === d);

      link.attr('d', (d: any) => {
        const source = resolveNode(d.source);
        const target = resolveNode(d.target);

        if (!source || !target || source.x === undefined || target.x === undefined) return '';

        const sx = source.x;
        const sy = source.y;
        const tx = target.x;
        const ty = target.y;

        const dx = tx - sx;
        const dy = ty - sy;
        let dr = Math.sqrt(dx * dx + dy * dy);

        if (dr < 1) {
          // perturbation min
          dr = 1;
        }

        // start & end points offset from center by rectangle half-diagonal along the line
        const halfW = NODE_WIDTH / 2;
        const halfH = NODE_HEIGHT / 2;
        // approximate offset along line using width (better than nothing)
        const offset = Math.max(halfW, halfH);

        const startX = sx + dx * (offset / dr);
        const startY = sy + dy * (offset / dr);
        const endX = tx - dx * (offset / dr);
        const endY = ty - dy * (offset / dr);

        const curveRadius = dr * 0.8; // courbure
        return `M${startX},${startY}A${curveRadius},${curveRadius} 0 0,1 ${endX},${endY}`;
      });

      // position des noeuds (g)
      this.nodeGroup
        .selectAll('.node')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    });

    // relancer simulation proprement
    this.simulation.alpha(1).restart();
    // this.fit();

    console.log(fct + " : END ")
  }

  /**
   * Filtre les relations pour n'afficher que la table cible et ses voisins.
   */
  private filterGraph(allRelations: Relation[], targetTableId: string) {
    let fct = "filterGraph"
    console.log(fct + " : allRelations : ", allRelations, "targetTableId : ", targetTableId)
    if (!targetTableId || !Array.isArray(allRelations)) {
      return this.buildGraph(allRelations);
    }

    const nodesToShow = new Set<string>();

    const filteredLinks = allRelations.filter(r => {
      console.log(fct + " : r : ", r )
      if (r.table === targetTableId || r.target_table === targetTableId) {
        nodesToShow.add(r.table);
        nodesToShow.add(r.target_table);
        console.log(fct + " return true . r : ", r )
        return true;
      }
      console.log(fct + " return false . r : ", r )
      return false;
    });

    const filteredNodes = Array.from(nodesToShow).map(id => ({
      id: id,
      tables: [id]
    }));
    console.log(fct + " filteredNodes : ", filteredNodes )

    const validNodeIds = new Set(filteredNodes.map(n => n.id));
    console.log(fct + " validNodeIds : ", validNodeIds )

    const finalLinks = filteredLinks.map(l => ({
      ...l,
      source: l.table,
      target: l.target_table
    })).filter(l => validNodeIds.has(l.source) && validNodeIds.has(l.target));
    console.log(fct + " finalLinks : ", finalLinks )

    return { nodes: filteredNodes, links: finalLinks };
  }

  private truncate(s: string | null | undefined, n: number): string {
    if (!n || n <= 0 || !s) { return ''; }
    if (s.length <= n) { return s; }
    if (n <= 2) { return s.substring(0, n); }
    return s.substring(0, n - 1) + '…';
  }

  private dragStarted(event: any, d: any) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragEnded(event: any, d: any) {
    if (!event.active) this.simulation.alphaTarget(0);

    // Laisse les nœuds être déplacés librement pour l'utilisateur
    // Si vous vouliez qu'ils restent là où ils sont placés (mode "sticky"):
    // d.fx = d.x;
    // d.fy = d.y;

    // Si le noeud n'est PAS le noeud "focus" (qui est fixé ailleurs dans render)
    // on retire le fx/fy de l'utilisateur pour le laisser dériver à nouveau (comportement D3 classique)
    // Cependant, pour un schéma de BDD, on veut souvent qu'il reste fixé

    // Option 1: Le laisser dériver (votre code actuel)
    // d.fx = null; 
    // d.fy = null;

    // Option 2: Le fixer là où l'utilisateur l'a mis (souvent mieux pour les schémas)
    if (this.isolatedTable !== d.id) {
      d.fx = d.x;
      d.fy = d.y;
    }
  }

  showTooltip(event: any, html: string) {
    const ttEl = this.tooltipRef.nativeElement as HTMLElement;
    ttEl.innerHTML = html;
    const containerRect = this.chartContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - containerRect.left + 12;
    const y = event.clientY - containerRect.top + 12;
    ttEl.style.left = `${x}px`;
    ttEl.style.top = `${y}px`;
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  zoomIn() {
    this.svg.transition().call(this.zoomBehavior.scaleBy as any, 1.3);
  }
  zoomOut() {
    this.svg.transition().call(this.zoomBehavior.scaleBy as any, 1 / 1.3);
  }

  // fit() {
  //   const cx = this.width / 2;
  //   const cy = this.height / 2;
  //   // recentre simplement
  //   this.svg.transition().call(this.zoomBehavior.transform as any, d3.zoomIdentity.translate(0, 0).scale(1).translate(cx - this.width / 2, cy - this.height / 2));
  // }
  // Remplacer votre fit() actuel par :
  fit() {
    if (!this.nodeGroup || !this.linkGroup || !this.svg) return;

    const nodesAndLinks = this.zoomG.node().getBBox(); // Bounding box de tout le contenu du groupe de zoom

    if (!nodesAndLinks || (nodesAndLinks.width === 0 && nodesAndLinks.height === 0)) {
      // Si la bbox est vide ou nulle (graphe vide), recentrer au centre par défaut
      this.svg.transition().duration(500).call(this.zoomBehavior.transform as any, d3.zoomIdentity);
      return;
    }

    const { x, y, width, height } = nodesAndLinks;
    const padding = 50; // Marge autour du graphe
    const scaleX = (this.width - 2 * padding) / width;
    const scaleY = (this.height - 2 * padding) / height;
    const scale = Math.min(scaleX, scaleY, 1.5); // Limiter le zoom max à 1.5 par exemple

    const translateX = this.width / 2 - scale * (x + width / 2);
    const translateY = this.height / 2 - scale * (y + height / 2);

    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    // Appliquer la transformation
    this.svg.transition().duration(750).call(this.zoomBehavior.transform as any, transform);
  }

  goBack() {
    window.close();
    setTimeout(() => this.router.navigate(['/table-viewer']), 200);
  }
}
