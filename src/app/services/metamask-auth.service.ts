import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/environment.prod';
import { from, Observable, switchMap } from 'rxjs';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class MetamaskAuthService {
  private provider: ethers.BrowserProvider;
  public isConnectedUser: boolean = false;
  public walletAddress: string | null = null;

  constructor(private http: HttpClient) {
    if (!window.ethereum) {
      throw new Error('MetaMask no está disponible');
    }
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  public login(): Observable<any> {
    const isAlreadyConnected = localStorage.getItem('isConnectedUser') === 'true';
    const savedAddress = localStorage.getItem('walletAddress');

    if (isAlreadyConnected && savedAddress) {
      this.walletAddress = savedAddress;
      this.isConnectedUser = true;
      return this.http.post(environment.apiUrl + '/auth/metamask', {
        address: savedAddress,
        message: `Sesión ya iniciada con anterioridad`,
        signature: 'sesión-previa'
      });
    }

    return from(
      (async () => {
        const signer = await this.provider.getSigner();
        const address = await signer.getAddress();
        const message = `Inicio de sesión seguro - ${new Date().toISOString()}`;
        const signature = await signer.signMessage(message);
        this.isConnectedUser = true;
        localStorage.setItem('isConnectedUser', 'true');
        localStorage.setItem('walletAddress', address);
        this.walletAddress = address;
        return this.http.post(environment.apiUrl + '/auth/metamask', { address, message, signature });
      })()
    ).pipe(switchMap((res$) => res$));
  }

  public isConnected(): Observable<boolean> {
    return from(
      (async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const connected = accounts.length > 0;
        if (connected) {
          localStorage.setItem('isConnectedUser', 'true');
          localStorage.setItem('walletAddress', accounts[0]);
          this.walletAddress = accounts[0];
          this.isConnectedUser = true;
        }
        return connected;
      })()
    );
  }

  public closeConnection(): void {
    if (localStorage.getItem('isConnectedUser') !== 'true') {
      alert('Sesión cerrada. Debes reconectar MetaMask para iniciar nuevamente.');
    }
    localStorage.removeItem('isConnectedUser');
    localStorage.removeItem('walletAddress');
    this.isConnectedUser = false;
    this.walletAddress = null;
    // MetaMask no se puede desconectar desde el código

  }
}
