import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import {
	useWeb3ExecuteFunction,
	useMoralis,
	useMoralisFile,
} from "react-moralis";
import { FormikProps, useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import { useSnackbar } from "notistack";
import Input from "../../../../components/Input";
import BasicLayout from "../../../../layout/BasicLayout";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../../list/createDeal";
import Deal from "../../../../contracts/Deal.json";
import Alert from "../../../../components/alert";

interface CreateDealInputProps {
	[key: string]: string;
}

const CreateDeal: FC<RouteComponentProps> = () => {
	const { abi } = Deal;
	const { fetch, error, isFetching, isLoading } = useWeb3ExecuteFunction();
	const { isUploading, saveFile } = useMoralisFile();
	const { Moralis } = useMoralis();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fileInputRef = useRef<any>();
	const initialFileData = { name: "", fileObject: {}, ipfs: "" };
	const [fileData, setFileData] = useState(initialFileData);
	const [dealCreated, setDealCreated] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const disableButton = useMemo(
		() => isFetching || isLoading || isUploading,
		[isFetching, isLoading, isUploading],
	);
	const [transactionStatus, setTransactionStatus] = useState({
		transactionCompleted: false,
		isSuccess: false,
		message: "",
	});

	/**
	 * @description Handle IPFS upload + File state changes
	 *
	 * @param event
	 */
	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		try {
			const fileName = event.target.value;
			const fileObject = event.target.files?.[0] ?? { uri: "" };
			saveFile("test.jpg", fileObject, {
				saveIPFS: true,
				onSuccess: (result) => {
					setFileData({
						name: fileName,
						fileObject,
						ipfs: result?._url,
					});
					setTransactionStatus({
						transactionCompleted: true,
						isSuccess: true,
						message: `Upload image success! Check it in here: ${result?._url}`,
					});
				},
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	};

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
					onSuccess: (result) => {
						if (result) {
							setDealCreated(true);
							enqueueSnackbar("Deal Created Successfully", {
								variant: "success",
							});
						}
					},
					onError: (e) => {
						if (e) {
							enqueueSnackbar("Deal Creation Failed. Please try again later.", {
								variant: "error",
							});
						}
					},
				});
			},
		});

	useEffect(() => {
		if (dealCreated && !error) {
			navigate("/dashboard");
		}
	}, [dealCreated, error]);

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
									<Grid item key={name} xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
										<Input
											title={title}
											name={name}
											disabled={disabled || disableButton}
											subtitle={subtitle}
											placeholder={placeholder}
											value={formattedValue()}
											required
											onChange={handleChange}
										/>
									</Grid>
								);
							})}
							<Grid item xs={12} md={6}>
								{fileData?.name ? (
									<Grid container alignItems="center">
										<Grid item>
											<a href={fileData?.ipfs} target="_blank" rel="noreferrer">
												<Typography>{fileData?.name}</Typography>
											</a>
										</Grid>
										<Grid item>
											<IconButton
												aria-label="delete"
												color="error"
												onClick={() => setFileData(initialFileData)}
											>
												<DeleteIcon />
											</IconButton>
										</Grid>
									</Grid>
								) : (
									<>
										<Button
											variant="contained"
											fullWidth
											onClick={() => fileInputRef.current.click()}
										>
											Upload Prospectus
										</Button>
										<input
											onChange={handleFileChange}
											multiple={false}
											ref={fileInputRef}
											required
											type="file"
											hidden
										/>
									</>
								)}
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
			<Snackbar
				open={transactionStatus.transactionCompleted}
				autoHideDuration={6000}
				onClose={() =>
					setTransactionStatus({
						transactionCompleted: false,
						isSuccess: true,
						message: "",
					})
				}
			>
				<Alert
					onClose={() =>
						setTransactionStatus({
							transactionCompleted: false,
							isSuccess: true,
							message: "",
						})
					}
					severity={transactionStatus.isSuccess ? "success" : "error"}
				>
					{transactionStatus.message}
				</Alert>
			</Snackbar>
		</BasicLayout>
	);
};

export default CreateDeal;
