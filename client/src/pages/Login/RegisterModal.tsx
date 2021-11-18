import { Formik, Field, Form, FormikHelpers } from "formik";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Modal from "@mui/material/Modal";

/* eslint react/jsx-curly-brace-presence: 0 */
// eslint-disable-next-line
interface RegisterInfo {
	address: string;
	isInvestor: boolean;
}
const RegisterModal = ({ address, isInvestor }: RegisterInfo): JSX.Element => {
	interface Values {
		address: string;
	}

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [creditRating, setCreditRating] = useState("A");
	console.log(isInvestor);
	const handleChange = (event: SelectChangeEvent) => {
		setCreditRating(event.target.value as string);
	};

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
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Formik
						initialValues={{ address: "" }}
						onSubmit={async (
							values: Values,
							{ setSubmitting }: FormikHelpers<Values>,
						) => {}}
					>
						<Box
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: 600,
								height: 650,
								bgcolor: "background.paper",
								border: "2px solid #000",
								boxShadow: 24,
								p: 4,
							}}
						>
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2"
								sx={{ marginBottom: 3.5 }}
							>
								REGISTER WALLET AS {isInvestor ? "INVESTOR" : "ISSUER"}
							</Typography>
							<TextField
								required
								id="name"
								label="Wallet Address"
								fullWidth
								disabled
								defaultValue={address}
								margin="normal"
							/>
							<TextField
								required
								id="holidngName"
								label="Holding Name"
								margin="normal"
								fullWidth
							/>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<TextField
										required
										id="representativeName"
										label="Representative Name"
										margin="normal"
										fullWidth
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										required
										id="representativeContact"
										label="Representative Contact"
										margin="normal"
										fullWidth
									/>
								</Grid>
							</Grid>
							<TextField
								required
								id="address"
								label="Full Address"
								margin="normal"
								sx={{ marginBottom: 3.5 }}
								multiline
								fullWidth
								rows={4}
							/>
							<FormControl fullWidth>
								<InputLabel id="credit-rating-select-label">
									Credit Rating
								</InputLabel>
								<Select
									labelId="credit-rating-label"
									id="credit-rating-select"
									value={creditRating}
									label="Credit Rating"
									onChange={handleChange}
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
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									boxPack: "end",
									justifyContent: "flex-end",
									paddingInlineStart: "1.5rem",
									paddingInlineEnd: "1.5rem",
									paddingTop: "1rem",
									paddingBottom: "1rem",
								}}
							>
								<Button>SUBMIT</Button>
							</Box>
						</Box>
					</Formik>
				</Modal>
			) : null}
		</>
	);
};

export default RegisterModal;
