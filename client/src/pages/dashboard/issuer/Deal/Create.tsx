import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useWeb3ExecuteFunction } from "react-moralis";
import { useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Input from "../../../../components/Input";
import BasicLayout from "../../../../layout/BasicLayout";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../../list/createDeal";
import Deal from "../../../../contracts/Deal.json";

const CreateDeal: FC<RouteComponentProps> = () => {
	const { abi } = Deal;

	const formik = useFormik({
		initialValues: {
			ISINNumber: "",
			dealName: "",
			initialOfferSize: "",
			minLaunchSize: "",
			faceValue: "",
			amountRequiredForEscrow: "",
			offerDateRange: "",
			term: "",
			interestRate: "",
			bondIssueDate: "",
			upfrontFee: "",
		},
		onSubmit: (values) => {
			console.log(values);
		},
	});

	const { fetch, data, isLoading, isFetching } = useWeb3ExecuteFunction({
		abi,
		functionName: "createDeal",
		contractAddress: "0x32e74eFB67BA4C8D9eF57bE37944ebED22c253D1",
		params: {},
	});

	return (
		<BasicLayout title="Create Deal" spacing={3}>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={3}>
					{createDealTextFields.map((field: CreateDealTextFieldsType) => {
						const {
							title,
							name,
							disabled,
							subtitle,
							placeholder,
							xs,
							sm,
							md,
							lg,
							xl,
						} = field;
						return (
							<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
								<Input
									title={title}
									name={name}
									disabled={disabled}
									subtitle={subtitle}
									placeholder={placeholder}
								/>
							</Grid>
						);
					})}
					<Grid item xs={12}>
						<Button type="submit">Create Deal</Button>
					</Grid>
				</Grid>
			</form>
		</BasicLayout>
	);
};

export default CreateDeal;
