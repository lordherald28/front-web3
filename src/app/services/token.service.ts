import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { from, map, switchMap, Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment.prod';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private provider = new ethers.BrowserProvider(window.ethereum);

  constructor(private http: HttpClient) { }

  public getBalance(walletAddress: string): Observable<string> {
    return from(this.provider.getBalance(walletAddress)).pipe(
      map(balance => ethers.formatEther(balance))
    );
  }

  public sendETH(to: string, amount: string): Observable<string> {
    return from(this.provider.getSigner()).pipe(
      switchMap(async signer => {
        const fromAddress = await signer.getAddress();

        // Primero obtenemos los datos de la tx desde el backend
        const txData = await this.http.post<any>(environment.apiUrl + '/transactions/build', {
          from: fromAddress,
          to,
          amount: amount.toString(),
        }
        ).toPromise();

        // Luego la firmamos y enviamos
        const txResponse = await signer.sendTransaction(txData);
        const receipt = await txResponse.wait();
        if (!receipt) {
          throw new Error('Transaction receipt is null');
        }
        return receipt.hash;
      }),
      switchMap((hash: string) => from(Promise.resolve(hash)))
    );
  }
}
