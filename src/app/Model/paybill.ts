export class Paybill {
    ID: number;
    Referral!: string;
    Payee: string;
    Period!: Date;
    OpenBalance: number;
    Paid: number;
    Billed: number;
    BilledMethod!: string;
   
}
