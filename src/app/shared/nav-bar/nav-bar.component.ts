import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MetamaskAuthService } from 'src/app/services/metamask-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html'
})
export class NavbarComponent {

  constructor(private router: Router, private readonly authService: MetamaskAuthService) { }

  logout(): void {
    this.authService.closeConnection();
    this.router.navigate(['/']);
  }
}
