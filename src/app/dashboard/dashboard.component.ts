import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { ethers } from 'ethers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  wallet: string = '';
  balance: string = '';
  to: string = '';
  amount: string = '';
  txHash: string = '';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Verifica conexión
    const wasConnected = localStorage.getItem('isConnectedUser') === 'true';

    if (!wasConnected) {
      this.router.navigate(['/']);
      return;
    }

    // Establece wallet y balance
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    this.wallet = await signer.getAddress();
    this.getBalance();
  }

  public getBalance(): void {
    this.tokenService.getBalance(this.wallet).subscribe({
      next: (balance) => (this.balance = balance),
      error: (err) => console.error('Error al obtener el balance:', err),
    });
  }

  public send(): void {
    if (this.to.toLowerCase() === this.wallet.toLowerCase()) {
      alert('❌ No puedes enviarte ETH a ti mismo');
      return;
    }

    this.tokenService.sendETH(this.to, this.amount).subscribe({
      next: (txHash) => {
        this.txHash = txHash;
        this.getBalance();
      },
      error: (err) => {
        console.error('Error al enviar ETH:', err);
      },
    });
  }

}
