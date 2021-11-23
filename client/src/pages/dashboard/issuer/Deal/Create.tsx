import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useWeb3ExecuteFunction } from "react-moralis";
import { FormikProps, useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Input from "../../../../components/Input";
import BasicLayout from "../../../../layout/BasicLayout";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../../list/createDeal";
import Deal from "../../../../contracts/Deal.json";

interface CreateDealInputProps {
	[key: string]: string;
}

const CreateDeal: FC<RouteComponentProps> = () => {
	const { abi } = Deal;
	const { fetch, data, isLoading, isFetching } = useWeb3ExecuteFunction({
		abi,
		functionName: "createDealIssuance",
		contractAddress: "0x3271fb4BC23661Bd8cec78D9554284C0Fa16Bb86",
		params: {},
	});

	const formik: FormikProps<CreateDealInputProps> =
		useFormik<CreateDealInputProps>({
			initialValues: {
				_ISIN: "",
				_dealName: "",
				_initSize: "",
				_minSize: "",
				_faceValue: "",
				_offerPrice: "",
				_offerCloseTime: "",
				_term: "",
				__interestRate: "",
				_interestRate: "",
				_upfrontFee: "",
			},
			onSubmit: (values) => {
				fetch({ params: values });
			},
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
						const { values, handleChange } = formik;
						return (
							<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
								<Input
									title={title}
									name={name}
									disabled={disabled}
									subtitle={subtitle}
									placeholder={placeholder}
									value={values[name] as string}
									onChange={handleChange}
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
