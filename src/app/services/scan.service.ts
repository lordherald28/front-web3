import { Injectable } from '@angular/core';
import { ethers, TransactionResponse } from 'ethers';
import { from, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScanService {
  private provider = new ethers.JsonRpcProvider('http://localhost:8545');

  public getTransactions(address: string) {
    return from(this.provider.getBlockNumber()).pipe(
      switchMap(async (latestBlock) => {
        const results = [];

        for (let i = latestBlock; i > latestBlock - 100 && i >= 0; i--) {
          const block = await this.provider.getBlock(i);

          if (!block || !block.transactions.length) continue;

          for (const txHash of block.transactions) {
            const tx = await this.provider.getTransaction(txHash);

            if (!tx || !tx.from || !tx.to || tx.value == null) continue;

            if (
              tx.from.toLowerCase() === address.toLowerCase() ||
              tx.to.toLowerCase() === address.toLowerCase()
            ) {
              results.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: ethers.formatEther(tx.value),
                blockNumber: tx.blockNumber,
              });
            }
          }

        }

        return results;
      }),
      switchMap(results => of(results))
    );
  }
}
