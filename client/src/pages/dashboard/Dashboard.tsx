import { FC, useState, useEffect } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import { useMoralis } from "react-moralis";
import BasicLayout from "../../layout/BasicLayout";

/* eslint react/jsx-props-no-spreading: 0 */
/* eslint @typescript-eslint/ban-types: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint @typescript-eslint/return-await: 0 */
interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const Dashboard: FC<RouteComponentProps> = () => {
	const [value, setValue] = useState(0);
	const { Moralis, isInitialized } = useMoralis();
	const [deals, setDeals] = useState<Array<Object>>([]);

	useEffect(() => {
		if (deals.length === 0 && isInitialized) {
			const Deal = Moralis.Object.extend("Deal");
			const query = new Moralis.Query(Deal);
			query.find().then((responses) => {
				// responses.map(async (response) => {
				// 	console.log(response.attributes.issuer);
				// 	const User = Moralis.Object.extend("_User");
				// 	const queryTwo = new Moralis.Query(User);
				// 	queryTwo.equalTo("ethAddress", response.attributes.issuer);
				// 	console.log(await queryTwo.first());
				// 	const data = response.attributes;
				// 	// data.issuer =
				// 	return data;
				// })

				setDeals(responses);
			});
		}
	}, [isInitialized]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<BasicLayout
				title="Dashboard"
				buttonText="Create Deal"
				buttonOnClick={() => navigate("/deal/create")}
				cardsArray={[
					{ title: "Total Value Raised", subtitle: "$ 350.2 M" },
					{ title: "Credit Rating", subtitle: "AA (Moody)" },
				]}
			/>
			<Box
				sx={{ borderBottom: 1, borderColor: "divider", width: "fit-content" }}
			>
				<Tabs value={value} onChange={handleChange}>
					<Tab label="Raising" {...a11yProps(0)} />
					<Tab label="Raised" {...a11yProps(1)} />
					<Tab label="Issued" {...a11yProps(2)} />
					<Tab label="Cancelled" {...a11yProps(3)} />
					<Tab label="Redeemed" {...a11yProps(4)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<Grid
					container
					rowSpacing={{ xs: 1, sm: 2, md: 3 }}
					columnSpacing={{ xs: 1, sm: 2, md: 3 }}
				>
					{deals.map((deal: any) => {
						const {
							// issuer,
							bondIssueDate,
							dealName,
							faceValue,
							initialOfferSize,
							interestRate,
							minLaunchSize,
							offerEndDate,
							offerStartDate,
							state,
							term,
							upfrontFee,
						} = deal.attributes;
						// const User = Moralis.Object.extend("_User");
						// const query = new Moralis.Query(User);
						// query.equalTo("ethAddress", issuer);
						// const object = await query.first();
						// console.log(object);
						return (
							<>
								<Grid item xs={12} sm={6} md={6} lg={3}>
									<Card>
										<CardActionArea>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													{dealName}
												</Typography>
												<Divider />
												<Grid
													container
													spacing={2}
													marginY={1}
													marginBottom={2}
												>
													<Grid item xs={6}>
														<Typography variant="h6">Issuer</Typography>
														<Typography>Credit Suisse</Typography>
													</Grid>
													<Grid item xs={6}>
														<Typography variant="h6">Credit Rating</Typography>
														<Typography>AAA</Typography>
													</Grid>
													<Grid item xs={6}>
														<Typography variant="h6">Interest Rate</Typography>
														<Typography>{interestRate}</Typography>
													</Grid>
													<Grid item xs={6}>
														<Typography variant="h6">Term</Typography>
														<Typography>{term} days</Typography>
													</Grid>
												</Grid>
												<LinearProgress variant="determinate" value={50} />
												<Typography variant="body2" marginTop={2} align="right">
													USDC 50,000,000/{minLaunchSize} (50%)
												</Typography>
											</CardContent>
										</CardActionArea>
										<CardActions>
											<Button
												size="small"
												color="primary"
												fullWidth
												onClick={() => navigate("/deal/view/1")}
											>
												{isInitialized &&
												Moralis.User.current()?.attributes?.isInvestor
													? "BID"
													: "EDIT"}
											</Button>
										</CardActions>
									</Card>
								</Grid>
							</>
						);
					})}
				</Grid>
			</TabPanel>
			<TabPanel value={value} index={1}>
				Item Two
			</TabPanel>
			<TabPanel value={value} index={2}>
				Item Three
			</TabPanel>
			<TabPanel value={value} index={3}>
				Item Four
			</TabPanel>
			<TabPanel value={value} index={4}>
				Item Five
			</TabPanel>
			<Pagination count={10} variant="outlined" shape="rounded" />
		</>

		// <BasicLayout
		// 	title="Dashboard"
		// 	buttonText="Create Deal"
		// 	buttonOnClick={() => navigate("/deal/create")}
		// 	cardsArray={[
		// 		{ title: "Total Value Raised", subtitle: "$ 350.2 M" },
		// 		{ title: "Credit Rating", subtitle: "AA (Moody)" },
		// 	]}
		// />
	);
};

export default Dashboard;
