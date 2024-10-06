export class IMASheets {
    ID: number;
    Date?: Date;
    Duration?: string;
    Staff?: string;
    ClientID?: string;
    Client?: string;
    ClientPhone?: string;
    Program?: string;
    SpecialProjectCode?: string;
    ActivityCode?: string;
    ApprovalDate: Date;
    SignedByAuthor?: boolean;
    SignedByClientGuardian?: boolean;
    SignedByCompleting?: boolean;
    MatchingEvv?: boolean;
    HoldFromInport: boolean;
    AuthorSignedOn: Date;
    NotCompliance: boolean;
    PaidDate: Date;
    NotSigned: boolean;
    Before7AM: boolean;
    After11PM: boolean;
    SchoolHours: boolean;
    ExceddingServiceLimit: boolean;
    DailyService: boolean;
    Over30Days: boolean;
    DaysBettweenServiceAndSigned: boolean;
    DoubleService: boolean;
    Memo?: string;
    Referral?: string;
    PayRate?: number;
    EstimateReciviableRate?: number;
    AmountReceived?: number;
    Piriod?: string;
    SheetName?: string;
    Imported: boolean;
    NotImportedReason?: string;
    Payable?: boolean;
    UniqueID?: string;
    BackToBack: boolean;
    PendingRequest: boolean;
    Over55Hours: boolean;
    MoreThanAuthorized: boolean;
    SessionID: string; 
    DSPPaid?: boolean;
    DSPPaidDate?: Date;
    LockReferral?: boolean;
    NonBillableCode?: boolean;
    Billable?: boolean;
    BillableMemo?: string;
    DoubleServiceStaff?: boolean;
    ClientHold?: boolean;
    DSPHold?: boolean;
    NotCompliantDaysAmount?: string;
    CustomSessionID?: string;
    selected?: boolean;
}