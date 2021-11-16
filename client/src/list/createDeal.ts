export interface CreateDealTextFieldsType {
	title: string;
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
		xs: 12,
		md: 6,
	},
	{
		title: "Deal Name",
		xs: 12,
		md: 6,
	},
	{
		title: "Initial Offer Size",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Min. Launch Size",
		type: "number",
		xs: 12,
		md: 6,
	},
	{
		title: "Face Value (Per Unit",
		xs: 12,
		md: 6,
	},
	{
		title: "Amount Required for Escrow",
		disabled: true,
		subtitle: "This is auto-calculated based on the 5% initial offer size",
		xs: 12,
		md: 6,
	},
	{
		title: "Offer Date Range",
		placeholder: "DD/MM/YYYY - DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Term (in days)",
		xs: 12,
		md: 3,
	},
	{
		title: "Interest Rate (in %)",
		xs: 12,
		md: 3,
	},
	{
		title: "Bond Issue Date (optional)",
		placeholder: "DD/MM/YYYY",
		xs: 12,
		md: 6,
	},
	{
		title: "Upfront fee (in %)",
		xs: 12,
		md: 3,
	},
];

export default createDealTextFields;
