import { FC, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "../../../../components/alert";

interface ViewDealProps extends RouteComponentProps {
	dealId?: number;
}

const ViewDeal: FC<ViewDealProps> = () => {
	// const { dealId } = props;
	const theme = useTheme();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
	const [cancel, setCancel] = useState(false);
	const [transactionStatus, setTransactionStatus] = useState({
		transactionCompleted: false,
		isSuccess: false,
		message: "",
	});
	const handleCancel = () => {
		setCancel(false);
		setTransactionStatus({
			transactionCompleted: true,
			isSuccess: true,
			message: "Deal Cancellation Success!",
		});
	};
	// useEffect(() => {
	// 	if (!dealId) {
	// 		navigate("/dashboard");
	// 	}
	// 	// eslint-disable-next-line
	// }, []);

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
			value: "Raising",
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
						<Grid item>
							{isLargeScreen && (
								<Grid container spacing={3}>
									<Grid item>
										<Button
											color="warning"
											variant="contained"
											startIcon={<EditIcon />}
											onClick={() => navigate("/deal/update/1")}
										>
											Update Deal
										</Button>
									</Grid>
									<Grid item>
										<Button
											color="error"
											variant="contained"
											startIcon={<CancelIcon />}
											onClick={() => setCancel(true)}
										>
											Cancel Deal
										</Button>
									</Grid>
								</Grid>
							)}
						</Grid>
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
				{!isLargeScreen && (
					<Grid item xs={12}>
						<Grid container spacing={3}>
							<Grid item>
								<Button
									color="warning"
									variant="contained"
									startIcon={<EditIcon />}
									onClick={() => navigate("/deal/view/1")}
								>
									Update Deal
								</Button>
							</Grid>
							<Grid item>
								<Button
									color="error"
									variant="contained"
									startIcon={<CancelIcon />}
									onClick={() => setCancel(true)}
								>
									Cancel Deal
								</Button>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
			<Dialog
				open={cancel}
				onClose={() => setCancel(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Cancel Bond?</DialogTitle>
				<DialogContent>
					<CardMedia component="img" image="/fail.gif" sx={{ width: 300 }} />
				</DialogContent>
				<DialogActions>
					<Button
						autoFocus
						onClick={() => setCancel(false)}
						variant="contained"
					>
						Revert
					</Button>
					<Button autoFocus onClick={handleCancel} color="error">
						Cancel
					</Button>
				</DialogActions>
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

export default ViewDeal;
