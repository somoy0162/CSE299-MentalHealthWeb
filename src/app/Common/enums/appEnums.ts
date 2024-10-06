export enum RecordStatus {
	Active = 1,
	Inactive = 2,
	Delete = 9,
}

export enum ResponseStatus {
	success = 1,
	fail = 2,
	warning = 3,
	internalServerError = 500,
	info = 300,
	unAuthorize = 401,
}

export enum Priority {
	low = 1,
	medium,
	high,
	urgent,
	important
}

export enum OrganizationType {
	Providence = 1,
	EmblemHealth = 2,
	Teleflex = 3,
	Cigna = 4,
	Aetna = 5,
}
export enum TaskHistoryActionType {
	Text = 1,
	Call = 2
}

export enum DataType {
	Image = 1,
	Text = 2,
	Stream = 3,
	Video = 4,
}

export enum WorkOrderStatus {
	Complete = 1,
	InComplete = 2,
}

export enum MessageType {
	Text = 1,
	Image = 2,
	Video = 3,
	OtherFile = 4,
}

export enum PatientAideNoteType {
	Patient = 1,
	Aide = 2,
}


export enum UserType {
	Staffing = 1,
	Patient = 2,
	Aide = 3,
}

export enum Source {
	HHAeXchange = 1,
	Smartsheet = 2
}

export enum Destination {
	Message = 1,
	ScheduleTask = 2,
	Patient = 3,
	Aide = 4,
}

export enum UserRole {
	SuperAdmin = 1,
	CompanyAdmin = 2,
	Agent = 3,
	Participant = 4,
}

export enum CommonAction {
	Active = 1,
	Inactive = 2,
	Remove = 3,
	View = 4,
	Edit = 5,
}

export let monthList = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export enum WeekList {
	'Sun' = 1,
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
};

export enum WeekFullNameList {
	'Sunday' = 1,
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
};

export enum Gender {
	Male = 1,
	Female
}

export enum ScheduleTaskRelatedTo {
	PATIENT = 1,
	AIDE
}

export enum ScheduleTaskStatus {
	Pending = 1,
	Progress,
	Test,
	Completed
}

export enum KeyBoardKey {
	KEY_A = 'A',
	KEY_C = 'C',
	KEY_V = 'V',
	KEY_D = 'D',
	KEY_Z = 'Z',
	KEY_Y = 'Y',
	KEY_PAGE_UP = 'PAGEUP',
	KEY_PAGE_DOWN = 'PAGEDOWN',
	KEY_TAB = 'TAB',
	KEY_LEFT = 'ARROWLEFT',
	KEY_UP = 'ARROWUP',
	KEY_RIGHT = 'ARROWRIGHT',
	KEY_DOWN = 'ARROWDOWN',
	KEY_F2 = 'F2',
	KEY_BACKSPACE = 'BACKSPACE',
	KEY_ESCAPE = 'ESCAPE',
	KEY_SPACE = ' ',
	KEY_DELETE = 'DELETE',
	KEY_HOME = 'HOME',
	KEY_END = 'END',
}

export enum ColumnDataType {
	Text = 1,
	Number,
	Date,
	List,
	Checkbox
}

export enum defaultTable {
	Aide = 1,
	Patient
}

export enum AppStoreKey {

}

export enum ColumnType {
	DEFAULT = 1,
	CUSTOM
}

export enum EmergencyContactRelationship {
	Child = 272562,
	Friend = 272578,
	GrandParent = 272582,
	Parent = 272600,
	Relative = 272601,
	Sibling = 272604,
	SignificantOther = 272605,
	Spouse = 272609,
	Other = -2
}

export enum ValidationType {
	minMaxValue = 1,
	minMaxlength,
	pattern
}

export enum PreferredContact {
	Home = 1,
	Office,
	Medic
}

export enum SourchType {
	NotMention = 0,
	HHAXService = 1,
	CRMWEBHHAXFORM = 2,
	CRMWEB = 3,
	SMARTSheet = 4,
	CSVOrExcel = 5
}
export enum TaskReferenceType {
	SheduleTask = 1,
	SheduleSubTask = 2,
	SheduleChildSubTask = 3
}

export enum NoteType {
	DefaultNotes = 1,
	DetailsNote
}

export enum NotificationType {
	Login = 1,
	Logout = 2,
	MessageSend = 3,
	MessageRecieved = 4
}

export const Priority2LabelMapping: any = {
	[Priority.high]: "High",
	[Priority.medium]: "Medium",
	[Priority.low]: "Low"
}

export const NO_OF_AUTO_COMPLETE_DATA = 100;
export const NO_OF_ROW_DATA = 100;
export const PAGE_SIZE = 100;
export const DEFAULT_DATE = "1900-01-01T00:00:00";
export const ROOM = "KJ Housing";

