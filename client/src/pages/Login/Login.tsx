import { RouteComponentProps } from "@reach/router";
import {
	Center,
	Image,
	Flex,
	FormControl,
	Radio,
	RadioGroup,
	Heading,
	Stack,
	ChakraProvider,
} from "@chakra-ui/react";
import Button from "@mui/material/Button";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import theme from "../../chakraTheme";

/* eslint react/prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint react/jsx-props-no-spreading: 0 */
// eslint-disable-next-line
const Login = (_props: RouteComponentProps): JSX.Element => {
	interface Values {
		is_investor: boolean;
	}
	const { authenticate, logout, Moralis, isAuthenticated } = useMoralis();
	const [isNewUser, setIsNewUser] = useState(false);
	const handleClose = () => setIsNewUser(false);
	return (
		<>
			<ChakraProvider theme={theme} resetCSS={false}>
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
								is_investor: false,
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
								}
								// else {
								// 	console.log("logging out");
								// 	logout();
								// }
								setIsNewUser(true);
								setSubmitting(false);
							}}
						>
							{(props) => (
								<Form>
									<Field name="is_investor">
										{({ field, form }: { field: any; form: any }) => (
											<FormControl
												isInvalid={form.errors.name && form.touched.name}
											>
												<RadioGroup
													key="is_investor"
													id="is_investor"
													onChange={(e) => {
														form.setFieldValue("is_investor", e);
														const event = {
															target: {
																name: "is_investor",
																value: e,
															},
														};
													}}
													value={field.value}
												>
													<Stack direction="column" spacing="24px">
														<Radio value="true">
															{" "}
															<FaFileInvoiceDollar />
															Investor
														</Radio>
														<Radio value="false">Issuer</Radio>
													</Stack>
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
				<Modal open={isNewUser} onClose={handleClose}>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 500,
							height: 700,
							bgcolor: "background.paper",
							border: "2px solid #000",
							boxShadow: 24,
							p: 4,
						}}
					>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							UNREGISTERED ACCOUNT
						</Typography>
						<CardMedia component="img" image="warning.gif" />
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							Looks like this wallet (
							{Moralis.User.current()?.attributes.ethAddress}) hasn’t registered
							yet. Would you like to register this account?
						</Typography>
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
							<RegisterModal />
							<Button
								onClick={handleClose}
								sx={{ backgroundColor: "red", color: "white" }}
							>
								NO
							</Button>
						</Box>
					</Box>
				</Modal>
			</ChakraProvider>
		</>
	);
};

export default Login;
