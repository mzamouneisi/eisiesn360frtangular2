import {Component, OnInit} from '@angular/core';
import {Credentials} from '../../credentials';
import {AuthService} from 'src/app/auth/services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials('', '');
  info="";
  error="";

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/my-profile'])
    }
  }

  public login(): void {
    this.authService.login(this.credentials, this);
  }
}
