import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetamaskAuthService } from '../services/metamask-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public error: string | null = null;
  public successMessage: string | null = null;

  constructor(
    private authService: MetamaskAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const wasConnected = localStorage.getItem('isConnectedUser') === 'true';

    if (wasConnected) {
      this.authService.isConnected().subscribe({
        next: (connected) => {
          if (connected) {
            this.successMessage = 'MetaMask está conectado.';
            this.router.navigate(['/dashboard']);
          } else {
            this.error = 'MetaMask no está conectado.';
          }
        },
        error: () => {
          this.error = 'Error al verificar la conexión con MetaMask.';
        }
      });
    }
  }

  public loginWithMetaMask(): void {
    this.error = null;
    this.successMessage = null;

    this.authService.login().subscribe({
      next: () => {
        this.successMessage = 'Conexión exitosa con MetaMask. ¡Bienvenido!';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Error al conectar con MetaMask.';
        console.error(err);
      }
    });
  }
}
