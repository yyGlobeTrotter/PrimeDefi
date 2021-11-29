import { FC, useState } from "react";
import { useMoralis } from "react-moralis";
import { useFormik } from "formik";
import { BsXLg } from "react-icons/bs";
import { FaEquals } from "react-icons/fa";
import { navigate, RouteComponentProps } from "@reach/router";
import { TextField } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Alert from "../../../components/alert";

const Bidding: FC<RouteComponentProps> = () => {
	const { Moralis } = useMoralis();
	const [bid, setBid] = useState(false);
	const [isBidded, setIsBidded] = useState(false);
	const [amountBid, setAmountBid] = useState("0");
	const [transactionStatus, setTransactionStatus] = useState({
		transactionCompleted: false,
		isSuccess: false,
		message: "",
	});

	const [unitToPurchase, setUnitToPurchase] = useState("100");
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			unitToPurchase,
			pricePerUnit: 100,
			totalBid: Number(unitToPurchase)
				? String(Number(unitToPurchase) * 100)
				: "",
		},
		onSubmit: (values) => {
			if (Number(values.unitToPurchase) > 0) {
				setBid(false);
				setIsBidded(true);
				setAmountBid(values.totalBid);
				setTransactionStatus({
					transactionCompleted: true,
					isSuccess: true,
					message: "Deal bidding Success!",
				});
			} else {
				setTransactionStatus({
					transactionCompleted: true,
					isSuccess: false,
					message:
						"Deal bidding failed. Please enter the proper number of units!",
				});
			}
		},
	});

	const DealOverview = [
		{
			name: "Credit Rating",
			value: "AAA",
		},
		{
			name: "Interest Rate",
			value: "3% p.a.",
		},
		{
			name: "Interest Payment Dates",
			value: "Quarterly",
		},
		{
			name: "Upfront Fee",
			value: "2%",
		},
		{
			name: "Term",
			value: "2 Years",
		},
		{
			name: "Face Value",
			value: "US$ 100 per unit",
		},
	];

	const DealHistoricalDetail = [
		{
			name: "Offer Size",
			value: "USD 100 Million",
		},
		{
			name: "Issue Date",
			value: "01/01/2021",
		},
		{
			name: "Offer Opening Date",
			value: "01/09/2021",
		},
		{
			name: "Min Launch Size",
			value: "USD 50 Million",
		},
		{
			name: "Max Launch Size",
			value: "USD 100 Million",
		},
		{
			name: "Offer Closing Date",
			value: "30/09/2021",
		},
	];

	const DealSummary = [
		{
			name: "Status",
			value: isBidded ? "Closed" : "Raising",
		},
		{
			name: "Credit Rating",
			value: "AAA",
		},
		{
			name: "Interest Rate",
			value: "3% p.a.",
		},
		{
			name: "Upfront Fee",
			value: "2%",
		},
		{
			name: "Date Close",
			value: "23/09/2021",
		},
	];

	return (
		<>
			<Grid container spacing={3} justifyContent="space-between">
				<Grid item xs={12} md={8}>
					<Grid container direction="column" spacing={3}>
						<Grid item>
							<Typography variant="h4">
								<b>NVIDIA CORP.DL-NOTES 2020(20/40)</b>
							</Typography>
						</Grid>
						<Grid item>
							<Typography>
								<AccountBalanceIcon sx={{ mr: 1 }} />
								Credit Suisse
							</Typography>
						</Grid>
						<Grid item>
							<Typography>US-000402625-0</Typography>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Grid container direction="column" spacing={2}>
										<Grid item>
											<Typography variant="h5">Overview</Typography>
										</Grid>
										<Grid item>
											<Grid container>
												{DealOverview.map((overview) => {
													const { name, value } = overview;
													return (
														<>
															<Grid item xs={6} md={3} sx={{ pb: 2 }}>
																<Typography>{name}</Typography>
															</Grid>
															<Grid item xs={6} md={3} sx={{ pb: 2 }}>
																<Typography color="text.secondary">
																	{value}
																</Typography>
															</Grid>
														</>
													);
												})}
											</Grid>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Grid container direction="column" spacing={2}>
										<Grid item>
											<Typography variant="h5">Historical Detail</Typography>
										</Grid>
										<Grid item>
											<Grid container>
												{DealHistoricalDetail.map((historicalDetail) => {
													const { name, value } = historicalDetail;
													return (
														<>
															<Grid item xs={6} md={3} sx={{ pb: 2 }}>
																<Typography>{name}</Typography>
															</Grid>
															<Grid item xs={6} md={3} sx={{ pb: 2 }}>
																<Typography color="text.secondary">
																	{value}
																</Typography>
															</Grid>
														</>
													);
												})}
											</Grid>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						{Number(amountBid) > 0 ? (
							<>
								<Grid item>
									<Typography variant="h5">Bidding Records</Typography>
									<TableContainer component={Paper}>
										<Table sx={{ minWidth: 650 }} aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell>Bidding Date and Time</TableCell>
													<TableCell align="right">Amount</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow
													key={1}
													sx={{
														"&:last-child td, &:last-child th": { border: 0 },
													}}
												>
													<TableCell component="th" scope="row">
														{`${new Date(
															1632142439 * 1000,
														).toDateString()} - ${new Date(
															1632142439 * 1000,
														).toLocaleTimeString()}`}
													</TableCell>
													<TableCell align="right">{amountBid}</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>
								<Grid item>
									<TableContainer component={Paper}>
										<Typography variant="h5">Interest Payment Dates</Typography>
										<Table sx={{ minWidth: 650 }} aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell>Date and Time</TableCell>
													<TableCell align="right">Amount per unit</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow
													key={1}
													sx={{
														"&:last-child td, &:last-child th": { border: 0 },
													}}
												>
													<TableCell component="th" scope="row">
														{`${new Date(
															Date.now(),
														).toDateString()} - ${new Date(
															Date.now(),
														).toLocaleTimeString()}`}
													</TableCell>
													<TableCell align="right">200</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>
							</>
						) : null}
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container direction="column" spacing={2}>
						<Grid item>
							<Card>
								<CardContent>
									<Grid container direction="column" spacing={3}>
										<Grid item>
											<Typography variant="h5">Summary</Typography>
										</Grid>
										<Grid item>
											<Grid container spacing={3}>
												{DealSummary.map((summary) => {
													const { name, value } = summary || {};
													return (
														<>
															<Grid item xs={12} md={6}>
																<Typography>{name}</Typography>
															</Grid>
															<Grid item xs={12} md={6}>
																<Typography color="text.secondary">
																	{value}
																</Typography>
															</Grid>
														</>
													);
												})}
											</Grid>
										</Grid>
										<Grid item>
											<Button
												color="warning"
												variant="contained"
												startIcon={<EditIcon />}
												onClick={() => setBid(true)}
												fullWidth
											>
												BID
											</Button>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Grid container direction="column" spacing={3}>
										<Grid item>
											<Typography variant="h5">Launch Progress</Typography>
										</Grid>
										<Grid item>
											<LinearProgress variant="determinate" value={50} />
										</Grid>
										<Grid item>
											<Typography variant="subtitle2" color="text.secondary">
												USDC 50,000,000/100,000,000 (50%)
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardContent>
									<Grid container direction="column" spacing={3}>
										<Grid item>
											<Typography variant="h5">Documents</Typography>
										</Grid>
										<Grid item>
											<ArticleIcon sx={{ mr: 2 }} />
											Offering Circular
										</Grid>
										<Grid item>
											<ArticleIcon sx={{ mr: 2 }} />
											Early Redemption Terms
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Dialog
				open={bid}
				onClose={() => setBid(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="lg"
			>
				<DialogTitle id="alert-dialog-title">Bidding</DialogTitle>

				<form onSubmit={formik.handleSubmit}>
					<DialogContent>
						<Typography variant="h5" gutterBottom>
							NVIDIA CORP.DL-NOTES 2020(20/40)
						</Typography>
						<DialogContentText gutterBottom>
							ISIN: US67066GAF19
						</DialogContentText>
						<Typography>Wallet address:</Typography>
						<Typography variant="body1" gutterBottom>
							{Moralis.User.current()?.attributes.ethAddress}
						</Typography>
						<Grid container direction="row" spacing={3}>
							<Grid item>
								<TextField
									required
									margin="dense"
									id="unitToPurchase"
									label="Unit to Purchase"
									onChange={(e) => {
										setUnitToPurchase(e.target.value);
									}}
									value={formik.values.unitToPurchase}
								/>
							</Grid>
							<Grid item>
								<Box mt={3}>
									<BsXLg />
								</Box>
							</Grid>
							<Grid item>
								<TextField
									disabled
									id="pricePerUnit"
									label="Price per Unit"
									margin="dense"
									value={formik.values.pricePerUnit}
								/>
							</Grid>
							<Grid item>
								<Box mt={3}>
									<FaEquals />
								</Box>
							</Grid>
							<Grid item>
								<TextField
									disabled
									required
									id="pricePerUnit"
									label="Total Bid"
									margin="dense"
									value={formik.values.totalBid}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setBid(false)} color="error">
							Cancel
						</Button>
						<Button autoFocus variant="contained" type="submit">
							BID
						</Button>
					</DialogActions>
				</form>
			</Dialog>
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
		</>
	);
};

export default Bidding;
