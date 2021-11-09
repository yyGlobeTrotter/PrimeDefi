export interface CreateDealTextFieldsType {
	title: string;
	disabled?: boolean;
	subtitle?: string;
	placeholder?: string;
}

const createDealTextFields: Array<CreateDealTextFieldsType> = [
	{
		title: "ISIN Number",
	},
	{
		title: "Deal Name",
	},
	{
		title: "Initial Offer Size",
	},
	{
		title: "Min. Launch Size",
	},
	{
		title: "Face Value (Per Unit",
	},
	{
		title: "Amount Required for Escrow",
		disabled: true,
		subtitle: "",
	},
	{
		title: "Offer Date Range",
		placeholder: "DD/MM/YYYY - DD/MM/YYYY",
	},
	{
		title: "Term (in days)",
	},
	{
		title: "Interest Rate (in %)",
	},
	{
		title: "Bond Issue Date (optional)",
		placeholder: "DD/MM/YYYY",
	},
	{
		title: "Upfront fee (in %)",
	},
];

export default createDealTextFields;
