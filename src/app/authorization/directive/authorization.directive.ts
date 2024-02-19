import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AuthGroup, Feature} from "../authorization.types";
import {AuthorizationService} from "../service/authorization.service";


@Directive({
  selector: '[appAuthorization]'
})
export class AuthorizationDirective implements OnInit {
  @Input() appAuthorization: string;
  @Input('feature') feature: Feature;
  @Input('permission') permission: AuthGroup;

  constructor(private authorizationService: AuthorizationService, private el: ElementRef) {

  }

  ngOnInit(): void {
    // //////////console.log("AuthorizationDirective ngOnInit appAuthorization=", this.appAuthorization)
    if (!this.authorizationService.hasPermission(this.feature, this.permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }

}
