import { useFormik } from "formik";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

/* eslint react/jsx-curly-brace-presence: 0 */
// eslint-disable-next-line
interface RegisterInfo {
	address: string;
	isInvestor: boolean;
}
const RegisterModal = ({ address, isInvestor }: RegisterInfo): JSX.Element => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const formik = useFormik({
		initialValues: {
			address,
			name: "",
			representativeName: "",
			representativeContact: "",
			representativeAddress: "",
			creditRating: "",
		},
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
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
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button type="submit">SUBMIT</Button>
						</DialogActions>
					</form>
				</Dialog>
			) : null}
		</>
	);
};

export default RegisterModal;
