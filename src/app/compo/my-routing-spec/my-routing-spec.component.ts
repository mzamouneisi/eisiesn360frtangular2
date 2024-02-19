import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-routing-spec',
  templateUrl: './my-routing-spec.component.html',
  styleUrls: ['./my-routing-spec.component.css']
})
export class MyRoutingSpecComponent implements OnInit {

  constructor(  private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    const r = this.route
    console.log("MyRoutingSpecComponent: route=", r)

    const path = this.route.snapshot.paramMap.get('path')
    console.log("MyRoutingSpecComponent: path=", path)

    if(path)  this.router.navigate([path]);

  }

}
