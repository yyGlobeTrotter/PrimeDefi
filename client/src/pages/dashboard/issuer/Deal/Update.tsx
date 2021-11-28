import { FC, useMemo, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useWeb3ExecuteFunction } from "react-moralis";
import { FormikProps, useFormik } from "formik";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import Input from "../../../../components/Input";
import BasicLayout from "../../../../layout/BasicLayout";
import updateDealTextFields, {
	UpdateDealTextFieldsType,
} from "../../../../list/updateDeal";
import Deal from "../../../../contracts/Deal.json";

interface UpdateDealInputProps {
	[key: string]: string;
}

const UpdateDeal: FC<RouteComponentProps> = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
		navigate("/dashboard");
	};

	const { abi } = Deal;
	const { fetch, isFetching, isLoading } = useWeb3ExecuteFunction();
	const disableButton = useMemo(
		() => isFetching || isLoading,
		[isFetching, isLoading],
	);

	const formik: FormikProps<UpdateDealInputProps> =
		useFormik<UpdateDealInputProps>({
			initialValues: {
				_ISIN: "US67066GAF19",
				_dealName: "NVIDIA CORP.DL-NOTES 2020(20/40)",
				_initSize: "100",
				_minSize: "10000",
				_faceValue: "5",
				_offerPrice: "5",
				_offerCloseTime: "01/11/2021 - 11/03/2021",
				_term: "50",
				_interestRate: "3",
				_upfrontFee: "5",
			},
			onSubmit: (values) => {
				const { _initSize: initSize, _offerPrice: offerPrice } = values;
				const actualOfferPrice =
					Math.round((Number(initSize) + Number.EPSILON) * 100 * 0.05) / 100;
				if (
					actualOfferPrice !==
					Math.round((Number(offerPrice) + Number.EPSILON) * 100) / 100
				) {
					enqueueSnackbar(
						`Amount Required for Escrow has to be 5% of initial offer size. (${actualOfferPrice})`,
						{
							variant: "warning",
						},
					);
				} else {
					fetch({
						params: {
							abi,
							functionName: "editDealIssuance",
							contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
							params: {
								...values,
								_interestPaymentDates: ["1637738471"],
							},
						},
					});
					setOpen(true);
				}
			},
		});
	return (
		<>
			<BasicLayout title="Update Deal" spacing={3}>
				<form onSubmit={formik.handleSubmit}>
					<Grid container spacing={3}>
						{updateDealTextFields.map((field: UpdateDealTextFieldsType) => {
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
							<Button type="submit" disabled={disableButton}>
								Edit Deal
							</Button>
						</Grid>
					</Grid>
				</form>
			</BasicLayout>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">EDIT SUCCESS</DialogTitle>
				<DialogContent>
					<CardMedia component="img" image="/check.gif" sx={{ width: 300 }} />
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Go to dashboard
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UpdateDeal;
