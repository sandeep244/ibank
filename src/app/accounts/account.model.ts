import { Transaction } from './transaction.model';

export interface Account {
 id: string;
 type: string;
 accountNumber: string;
 amount: number;
 creator: string;
 trxns: Transaction[];
}
