export interface CreateDealTextFieldsType {
	title: string;
	name: string;
	disabled?: boolean;
	subtitle?: string;
	placeholder?: string;
	type?: string;
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
}

const createDealTextFields: Array<CreateDealTextFieldsType> = [
	{
		title: "ISIN Number",
		name: "ISINNumber",
		xs: 12,
		md: 6,
	},
	{
		title: "Deal Name",
		name: "dealName",
		xs: 12,
		md: 6,
	},
	{
		title: "Initial Offer Size",
		name: "initialOfferSize",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Min. Launch Size",
		name: "minLaunchSize",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Face Value (Per Unit)",
		name: "faceValue",
		xs: 12,
		md: 6,
	},
	{
		title: "Amount Required for Escrow",
		name: "amountRequiredForEscrow",
		disabled: true,
		subtitle: "This is auto-calculated based on the 5% initial offer size",
		xs: 12,
		md: 6,
	},
	{
		title: "Offer Date Range",
		name: "offerDateRange",
		placeholder: "DD/MM/YYYY - DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Term (in days)",
		name: "term",
		xs: 12,
		md: 3,
	},
	{
		title: "Interest Rate (in %)",
		name: "interestRate",
		xs: 12,
		md: 3,
	},
	{
		title: "Bond Issue Date (optional)",
		name: "bondIssueDate",
		placeholder: "DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Upfront fee (in %)",
		name: "upfrontFee",
		xs: 12,
		md: 3,
	},
];

export default createDealTextFields;
