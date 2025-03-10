import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'esn360';
  height = 10;  // %
  showHeightInput = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router
    ) {
    this.changeNavigationRouting()
  }

  dblclick(event) {
    this.showHeightInput = !this.showHeightInput;
  }

  changeNavigationRouting() {

    // console.log("hi deploy2")

    // console.log("changeNavigationRouting: route", this.route)

    // console.log("changeNavigationRouting: router", this.router)

    // const ar = this.activatedRoute;
    // console.log("changeNavigationRouting: ar", ar)

    // const snap = this.activatedRoute.snapshot;
    // console.log("changeNavigationRouting: snap", snap)

    const url = this.activatedRoute.snapshot.url;
    console.log("changeNavigationRouting: url", url)
    
    const path = this.activatedRoute.snapshot.queryParams['path'];
    console.log("changeNavigationRouting: path", path)
    
    const navigateTo = '/' + path;

    if (path) {
      this.router.navigate([navigateTo]);
    }
  }

}
