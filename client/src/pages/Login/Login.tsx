import { useNavigate, RouteComponentProps } from "@reach/router";
import { Center, Image, Flex, Heading, ChakraProvider } from "@chakra-ui/react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
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
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import Alert from "../../components/alert";


/* eslint react/prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint react/jsx-props-no-spreading: 0 */
// eslint-disable-next-line
const Login = (_props: RouteComponentProps): JSX.Element => {
	interface Values {
		is_investor: string;
	}
	const navigate  = useNavigate();
	const { authenticate, Moralis, isInitialized } = useMoralis();
	const [isNewUser, setIsNewUser] = useState(false);
	const [isInvestor, setIsInvestor] = useState(false);
	const [isMismatchedRole, setIsMismatchedRole] = useState(false);
	const handleClose = () => setIsNewUser(false);
	
	return (
		<>
			<ChakraProvider resetCSS={false}>
				<Flex
					direction={{
						lg: "row",
						base: "column",
					}}
				>
					<Flex
						direction="column"
						alignItems="center"
						style={{
							flexGrow: 1,
						}}
					>
						<Image
							src={`${window.location.origin}/login.png`}
							pt={5}
							pl={5}
							pb={5}
							maxHeight="100vh"
						/>
					</Flex>
					<Flex
						mt={10}
						direction="column"
						align="center"
						minWidth={{
							lg: 400,
							xl: 600,
						}}
					>
						<Center>
							<Heading
								size="md"
								color="gray.500"
								fontFamily="cairo"
								letterSpacing="0.18em"
								mt={5}
								fontWeight="600"
							>
								PRIME DEFI
							</Heading>
						</Center>
						<Center mt="20vh">
							<Heading
								size="lg"
								mb={5}
								fontWeight="semibold"
								textAlign="center"
							>
								Login As
							</Heading>
						</Center>

						<Formik
							initialValues={{
								is_investor: "",
							}}
							onSubmit={async (
								values: Values,
								{ setSubmitting }: FormikHelpers<Values>,
							) => {
								if (!Moralis.User.current()) {
									await authenticate();
									if (
										Moralis.User.current()?.attributes.is_investor ===
											undefined ||
										Moralis.User.current()?.attributes.is_investor === null
									) {
										setIsNewUser(true);
									}
								} else if (Moralis.User.current()) {
									if (
										Moralis.User.current()?.attributes.is_investor.toString() ===
										values.is_investor
									) {
										if(values.is_investor) {
											navigate("/dashboard");
										}
										else {
											navigate("/issuer");
										}
									} else {
										setIsMismatchedRole(true);
									}
								}
								setIsNewUser(true);
								setIsInvestor(values.is_investor === "true");
								setSubmitting(false);
							}}
						>
							{(props) => (
								<Form>
									<Field name="is_investor">
										{({ field, form }: { field: any; form: any }) => (
											<FormControl
												component="fieldset"
												sx={{ display: "block" }}
											>
												<RadioGroup
													name="controlled-radio-buttons-group"
													value={field.value}
													onChange={(e) => {
														form.setFieldValue("is_investor", e.target.value);
													}}
												>
													<FormControlLabel
														value="true"
														control={<Radio required/>}
														label="Investor"
													/>
													<FormControlLabel
														value="false"
														control={<Radio required/>}
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
					</Flex>
				</Flex>
			</ChakraProvider>
			{isInitialized ? (
				<Dialog open={isNewUser} onClose={handleClose}>
				<Stack alignItems="center" m={3}>
					<DialogTitle>UNREGISTERED ACCOUNT</DialogTitle>
					<CardMedia component="img" image="warning.gif" sx={{ width: 300 }} />
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
			) : null}
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
