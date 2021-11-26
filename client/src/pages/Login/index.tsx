import { FC, useState, useEffect } from "react";
import { useLocation, RouteComponentProps, navigate } from "@reach/router";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RegisterModal from "./RegisterModal";
import Alert from "../../components/alert";

interface Values {
	isInvestor: boolean;
}

/* eslint react/prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint react/jsx-props-no-spreading: 0 */
/* eslint react/style-prop-object: 0 */
// eslint-disable-next-line
const Login: FC<RouteComponentProps> = () => {
	const { authenticate, Moralis, isInitialized, isAuthenticated, logout } =
		useMoralis();
	const { pathname } = useLocation();
	const [isNewUser, setIsNewUser] = useState(false);
	const [isInvestor, setIsInvestor] = useState(false);
	const [isMismatchedRole, setIsMismatchedRole] = useState(false);
	const handleClose = () => setIsNewUser(false);

	useEffect(() => {
		if (!isAuthenticated) {
			if (pathname === "/") {
				navigate("/login");
			}
		} else {
			navigate("/dashboard");
		}
	}, [pathname, isAuthenticated]);

	return (
		<>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					p: 1,
					m: 1,
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexGrow: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img
						src="login.png"
						alt="illustration"
						style={{
							height: "100vh",
						}}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: 500,
					}}
				>
					<Stack alignItems="center" m={3}>
						<Typography variant="h4">PRIME DEFI</Typography>
						<Typography variant="h5" style={{ marginTop: "20vh" }}>
							Login As
						</Typography>
						<Formik
							initialValues={{
								isInvestor: false,
							}}
							onSubmit={async (
								values: Values,
								{ setSubmitting }: FormikHelpers<Values>,
							) => {
								if (!Moralis.User.current()) {
									await authenticate();
								}
								if (
									Moralis.User.current()?.attributes?.isInvestor ===
										undefined ||
									Moralis.User.current()?.attributes?.isInvestor === null
								) {
									setIsNewUser(true);
								} else if (
									Moralis.User.current()?.attributes.isInvestor.toString() ===
									values.isInvestor.toString()
								) {
									if (Moralis.User.current()?.attributes.isInvestor) {
										navigate("/dashboard");
									} else {
										navigate("/dashboard");
									}
								} else {
									setIsMismatchedRole(true);
									logout();
								}
								setIsInvestor(values.isInvestor === true);
								setSubmitting(false);
							}}
						>
							{(props) => (
								<Form>
									<Field name="isInvestor">
										{({ field, form }: { field: any; form: any }) => (
											<FormControl
												component="fieldset"
												sx={{ display: "block" }}
											>
												<RadioGroup
													name="controlled-radio-buttons-group"
													value={field.value}
													onChange={(e) => {
														form.setFieldValue("isInvestor", e.target.value);
													}}
												>
													<FormControlLabel
														value="true"
														control={<Radio required />}
														label="Investor"
													/>
													<FormControlLabel
														value="false"
														control={<Radio required />}
														label="Issuer"
													/>
												</RadioGroup>
											</FormControl>
										)}
									</Field>
									{props.isSubmitting ? (
										<LoadingButton
											loading
											variant="outlined"
											sx={{ marginTop: 2 }}
										>
											Submit
										</LoadingButton>
									) : (
										<Button type="submit" sx={{ marginTop: 2 }}>
											CONNECT WALLET
										</Button>
									)}
								</Form>
							)}
						</Formik>
					</Stack>
				</Box>
			</Box>
			{isInitialized ? (
				<Dialog open={isNewUser} onClose={handleClose}>
					<Stack alignItems="center" m={3}>
						<DialogTitle>UNREGISTERED ACCOUNT</DialogTitle>
						<CardMedia
							component="img"
							image="warning.gif"
							sx={{ width: 300 }}
						/>
						<Typography id="modal-modal-description" my={1}>
							Looks like this wallet (
							{Moralis.User.current()?.attributes.ethAddress}) hasn’t registered
							yet. Would you like to register this account?
						</Typography>
						<DialogActions>
							<RegisterModal
								address={Moralis.User.current()?.attributes.ethAddress}
								isInvestor={isInvestor}
								Moralis={Moralis}
							/>
							<Button
								onClick={handleClose}
								sx={{ backgroundColor: "red", color: "white" }}
							>
								NO
							</Button>
						</DialogActions>
					</Stack>
				</Dialog>
			) : (
				<></>
			)}
			<Snackbar
				open={isMismatchedRole}
				autoHideDuration={6000}
				onClose={() => setIsMismatchedRole(false)}
			>
				<Alert onClose={() => setIsMismatchedRole(false)} severity="error">
					Wrong Role! Please use different address.
				</Alert>
			</Snackbar>
		</>
	);
};

export default Login;
