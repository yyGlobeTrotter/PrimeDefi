/* eslint-disable no-underscore-dangle */
import { FC, useMemo } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";
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
	const { fetch, error, isFetching, isLoading } = useWeb3ExecuteFunction();
	const { Moralis } = useMoralis();
	const disableButton = useMemo(
		() => isFetching || isLoading,
		[isFetching, isLoading],
	);

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
				_interestRate: "",
				_bondIssueDate: "",
				_upfrontFee: "",
			},
			onSubmit: (values) => {
				const formattedValues = {
					...values,
					_offerPrice: (parseInt(values._initSize, 10) * 0.05).toString(),
					_interestRate: Moralis.Units.Token(values?._interestRate, 3),
					_upfrontFee: Moralis.Units.Token(values?._upfrontFee, 3),
					_interestPaymentDates: [values._bondIssueDate],
				};

				fetch({
					params: {
						abi,
						functionName: "createDealIssuance",
						contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
						params: formattedValues,
					},
					onSuccess: () => {},
					onComplete: () => {
						if (!error) {
							navigate("/dashboard");
						}
					},
				});
			},
		});

	return (
		<BasicLayout title="Create Deal" spacing={3}>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
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
								const formattedValue = () => {
									switch (name) {
										case "_offerPrice":
											return (
												parseInt(values._initSize, 10) * 0.05 || 0
											).toString();
										default:
											return values[name];
									}
								};

								return (
									<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
										<Input
											title={title}
											name={name}
											disabled={disabled || disableButton}
											subtitle={subtitle}
											placeholder={placeholder}
											value={formattedValue()}
											onChange={handleChange}
										/>
									</Grid>
								);
							})}
							<Grid item xs={12} md={6}>
								<Button variant="contained" fullWidth>
									Upload Prospectus
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justifyContent="end" spacing={3}>
							<Grid item xs={12} md={2}>
								<Button variant="outlined" color="error" fullWidth>
									Cancel
								</Button>
							</Grid>
							<Grid item xs={12} md={2}>
								<Button
									type="submit"
									variant="contained"
									disabled={disableButton}
									fullWidth
								>
									Create Deal
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</BasicLayout>
	);
};

export default CreateDeal;
