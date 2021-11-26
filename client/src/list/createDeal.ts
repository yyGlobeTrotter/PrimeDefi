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
		name: "_ISIN",
		xs: 12,
		md: 6,
	},
	{
		title: "Deal Name",
		name: "_dealName",
		xs: 12,
		md: 6,
	},
	{
		title: "Initial Offer Size",
		name: "_initSize",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Min. Launch Size",
		name: "_minSize",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Face Value (Per Unit)",
		name: "_faceValue",
		xs: 12,
		md: 6,
	},
	{
		title: "Amount Required for Escrow",
		name: "_offerPrice",
		// disabled: true,
		subtitle: "This is auto-calculated based on the 5% initial offer size",
		xs: 12,
		md: 6,
	},
	{
		title: "Offer Date Range",
		name: "_offerCloseTime",
		placeholder: "DD/MM/YYYY - DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Term (in days)",
		name: "_term",
		xs: 12,
		md: 3,
	},
	{
		title: "Interest Rate (in %)",
		name: "_interestRate",
		xs: 12,
		md: 3,
	},
	{
		title: "Bond Issue Date (optional)",
		name: "_interestRate",
		placeholder: "DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Upfront fee (in %)",
		name: "_upfrontFee",
		xs: 12,
		md: 3,
	},
];

export default createDealTextFields;
