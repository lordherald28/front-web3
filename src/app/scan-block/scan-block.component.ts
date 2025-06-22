import { Component, OnInit } from '@angular/core';
import { ScanService } from 'src/app/services/scan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-block',
  templateUrl: './scan-block.component.html',
  styleUrls: ['./scan-block.component.css']
})
export class ScanBlockComponent implements OnInit {
  transactions: any[] = [];
  loading = true;
  userAddress = '';

  constructor(
    private scanService: ScanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const wasConnected = localStorage.getItem('isConnectedUser') === 'true';
    this.userAddress = localStorage.getItem('walletAddress') || '';

    if (!wasConnected || !this.userAddress) {
      this.router.navigate(['/']);
      return;
    }

    this.scanService.getTransactions(this.userAddress).subscribe({
      next: (txs) => {
        this.transactions = txs;
        this.loading = false;
      },
      error: () => {
        console.warn('⚠️ Error cargando transacciones');
        this.loading = false;
      }
    });
  }
}
