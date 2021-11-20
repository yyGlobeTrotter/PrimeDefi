import MoralisType from "moralis";
import { useNavigate } from "@reach/router";
import { useFormik } from "formik";
import { useState } from "react";
import { useWeb3ExecuteFunction } from "react-moralis";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Deal from "../../contracts/Deal.json";
import Alert from "../../components/alert";

/* eslint react/jsx-curly-brace-presence: 0 */
/* eslint react/jsx-props-no-spreading: 0 */
// /* eslint jsx-a11y\label-has-associated-control: 0 */
// eslint-disable-next-line
interface RegisterInfo {
	address: string;
	isInvestor: boolean;
	Moralis: MoralisType;
}

const RegisterModal = ({
	address,
	isInvestor,
	Moralis,
}: RegisterInfo): JSX.Element => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [transactionStatus, setTransactionStatus] = useState({
		transactionCompleted: false,
		isSuccess: false,
		message: "",
	});
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [documents, setDocuments] = useState(false);
	const handleDocuments = (e: any) => setDocuments(e.target.files);
	const { data, error, fetch, isFetching, isLoading } =
		useWeb3ExecuteFunction();
	// console.log(data);
	// if(!isFetching) {
	// 	console.log(error);
	// 	console.log(data);
	// }
	// else {
	// 	console.log(false);
	// }

	const closeSnackbar = () => {
		if (transactionStatus.isSuccess) {
			if (isInvestor) {
				navigate("/dashboard");
			} else {
				navigate("/issuer");
			}
		}
		setTransactionStatus({
			transactionCompleted: false,
			isSuccess: false,
			message: "",
		});
	};
	const formik = useFormik({
		initialValues: {
			address,
			name: "",
			representativeName: "",
			representativeContact: "",
			representativeAddress: "",
			creditRating: "",
		},
		onSubmit: async (values) => {
			const User = Moralis.Object.extend("_User");
			const query = new Moralis.Query(User);
			query.equalTo("ethAddress", values.address);
			const object = await query.first();
			if (object) {
				object.set("holdingName", values.name);
				object.set("representativeName", values.representativeName);
				object.set("representativeContact", values.representativeContact);
				object.set("representativeAddress", values.representativeAddress);
				object.set("creditRating", values.creditRating);
				object.save();
				fetch({
					onSuccess: (results) => {
						setTransactionStatus({
							transactionCompleted: true,
							isSuccess: true,
							message:
								"Transaction success! Check your wallet for latest transaction status",
						});
					},
					onError: (errors) => {
						setTransactionStatus({
							transactionCompleted: true,
							isSuccess: false,
							message:
								"Transaction failed! Check your wallet for latest transaction status",
						});
					},
					params: {
						abi: Deal.abi,
						contractAddress: "0x32e74efb67ba4c8d9ef57be37944ebed22c253d1",
						functionName: "createIssuer",
						params: {
							_name: `${values.name} - ${values.representativeName}`,
							_creditRating: values.creditRating,
						},
					},
				});
			}
		},
	});
	return (
		<>
			<Button
				onClick={handleOpen}
				sx={{
					marginRight: "0.75rem",
					backgroundColor: "#38A169",
					color: "white",
				}}
			>
				YES
			</Button>
			{open ? (
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle id="alert-dialog-title">
						REGISTER WALLET AS {isInvestor ? "INVESTOR" : "ISSUER"}
					</DialogTitle>
					<form onSubmit={formik.handleSubmit}>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								<TextField
									id="address"
									label="Wallet Address"
									fullWidth
									disabled
									margin="normal"
									value={formik.values.address}
									onChange={formik.handleChange}
								/>
								<TextField
									required
									id="name"
									label="Holding Name"
									margin="normal"
									fullWidth
									onChange={formik.handleChange}
									value={formik.values.name}
								/>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											required
											id="representativeName"
											label="Representative Name"
											margin="normal"
											fullWidth
											onChange={formik.handleChange}
											value={formik.values.representativeName}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											required
											id="representativeContact"
											label="Representative Contact"
											margin="normal"
											fullWidth
											onChange={formik.handleChange}
											value={formik.values.representativeContact}
										/>
									</Grid>
								</Grid>
								<TextField
									required
									id="representativeAddress"
									label="Full Address"
									margin="normal"
									sx={{ marginBottom: 3.5 }}
									multiline
									fullWidth
									rows={4}
									onChange={formik.handleChange}
									value={formik.values.representativeAddress}
								/>
								<FormControl fullWidth required>
									<InputLabel id="credit-rating-select-label">
										Credit Rating
									</InputLabel>
									<Select
										name="creditRating"
										id="creditRating"
										value={formik.values.creditRating}
										label="Credit Rating"
										onChange={formik.handleChange}
										sx={{ marginBottom: 2 }}
									>
										<MenuItem value="AAA">AAA</MenuItem>
										<MenuItem value="AA1">AA1</MenuItem>
										<MenuItem value="AA2">AA2</MenuItem>
										<MenuItem value="AA3">AA3</MenuItem>
										<MenuItem value="A1">A1</MenuItem>
										<MenuItem value="A2">A2</MenuItem>
										<MenuItem value="A3">A3</MenuItem>
										<MenuItem value="BAA1">BAA1</MenuItem>
										<MenuItem value="BAA2">BAA2</MenuItem>
										<MenuItem value="BAA3">BAA3</MenuItem>
										<MenuItem value="BA1">BA1</MenuItem>
										<MenuItem value="BA2">BA2</MenuItem>
										<MenuItem value="BA3">BA3</MenuItem>
										<MenuItem value="B1">B1</MenuItem>
										<MenuItem value="B2">B2</MenuItem>
										<MenuItem value="B3">B3</MenuItem>
										<MenuItem value="CAA1">BAA1</MenuItem>
										<MenuItem value="CAA2">BAA2</MenuItem>
										<MenuItem value="CAA3">BAA3</MenuItem>
										<MenuItem value="CA">CA</MenuItem>
										<MenuItem value="C">C</MenuItem>
									</Select>
								</FormControl>
								<label htmlFor="contained-button-file">
									<input
										id="contained-button-file"
										multiple
										type="file"
										onChange={handleDocuments}
										style={{display: 'none'}}
									/>
									<Button variant="contained" component="span">
										Upload KYC Documents
									</Button>
								</label>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button type="submit">SUBMIT</Button>
						</DialogActions>
					</form>
				</Dialog>
			) : null}
			<Snackbar
				open={transactionStatus.transactionCompleted}
				autoHideDuration={transactionStatus.isSuccess ? null : 6000}
				onClose={closeSnackbar}
			>
				<Alert
					onClose={closeSnackbar}
					severity={transactionStatus.isSuccess ? "success" : "error"}
				>
					{transactionStatus.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default RegisterModal;
