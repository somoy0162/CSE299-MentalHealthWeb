export class Deposit {
    ID: number;
    Amount: number;
    Reference: string;
    Memo: string;
    BankAccount: string;
    Date: Date;
    Vendor: string;

    //NOT Mapped
    LinkedAmount: number=0;
    UnlinkedAmount: number=0;
}
