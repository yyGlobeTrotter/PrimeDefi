import { FC, useState, useEffect, useMemo } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import {
	useMoralis,
	useMoralisWeb3ApiCall,
	useMoralisWeb3Api,
	useWeb3ExecuteFunction,
} from "react-moralis";
import { useSnackbar } from "notistack";
import BasicLayout from "../../layout/BasicLayout";
import { useGlobalContext } from "../../context/GlobalContext";
import Deal from "../../contracts/Deal.json";
import DealCard from "../../components/DealCard";

/* eslint react/jsx-props-no-spreading: 0 */
/* eslint @typescript-eslint/ban-types: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint @typescript-eslint/return-await: 0 */
interface TabPanelProps {
	index: number;
	value: number;
	loading?: boolean;
}

const TabPanel: FC<TabPanelProps> = (props) => {
	const { children, value, index, loading = false, ...other } = props;

	return loading ? (
		<Grid
			container
			direction="column"
			spacing={2}
			justifyContent="center"
			alignItems="center"
			sx={{ width: "82vw", minHeight: "40vh" }}
		>
			<Grid item>
				<CircularProgress color="primary" />
			</Grid>
			<Grid item>
				<Typography>Loading data...</Typography>
			</Grid>
		</Grid>
	) : (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ pt: 3, pb: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
};

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const Dashboard: FC<RouteComponentProps> = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [value, setValue] = useState(0);
	const [deals, setDeals] = useState<string[]>([]);
	const { abi } = Deal;
	const { isInitialized, isWeb3Enabled } = useMoralis();
	const { chain, walletAddress } = useGlobalContext();
	const Web3Api = useMoralisWeb3Api();

	/**
	 * @description Fetch `LogCreateDealIssuance` event logs
	 */
	const {
		fetch: runGetContractEvents,
		isLoading: isGetContractEventsLoading,
		isFetching: isGetContractEventsFetching,
	} = useMoralisWeb3ApiCall(Web3Api.native.getContractEvents, {
		chain,
		address: "0x7af9B4e4006478160569BF956aE2241F49C43104",
		topic: "0xf4ff7e1fcb22d6f38926a942322a8f0987d86cdbfed9991556932ad24c1d2e6f",
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		abi: abi.find(
			(event) =>
				event.name === "LogCreateDealIssuance" && event.type === "event",
		),
	});

	/**
	 * [NOT WORKING YET]
	 * @description Get Issuer Details For Display on Top of Dashboard Page
	 */
	useWeb3ExecuteFunction({
		abi,
		functionName: "getAllIssuerDetailsByAddr",
		contractAddress: "0x7af9B4e4006478160569BF956aE2241F49C43104",
		params: {
			_addr: walletAddress,
		},
	});

	const isLodingAndFetchingData = useMemo(
		() => isGetContractEventsFetching || isGetContractEventsLoading,
		[isGetContractEventsFetching, isGetContractEventsLoading],
	);

	/**
	 * @description Handle Tab Value changes
	 *
	 * @param newValue - new tab index
	 */
	const handleChange = (_: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		if (isInitialized && isWeb3Enabled) {
			runGetContractEvents({
				onSuccess: (res) => {
					if (res) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						setDeals(res?.result?.map((deal: Object) => deal?.data?._ISIN));
					}
				},
				onError: (e) => {
					if (e) {
						enqueueSnackbar(
							"Failed to fetch deals data. Please try again later.",
							{ variant: "error" },
						);
					}
				},
			});
		}
	}, [isInitialized, isWeb3Enabled]);

	// useEffect(() => {
	// 	if (isInitialized && isWeb3Enabled && walletAddress) {
	// 		fetch({
	// 			onSuccess: (result) => console.log(result),
	// 			onError: (e) => console.error(e),
	// 		});
	// 	}
	// }, [isInitialized, isWeb3Enabled, walletAddress]);

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
			>
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
				<TabPanel value={value} index={0} loading={isLodingAndFetchingData}>
					<Grid
						container
						rowSpacing={{ xs: 1, sm: 2, md: 3 }}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					>
						{deals.map((deal: string) => {
							return (
								<Grid item key={deal} xs={12} sm={6} md={6} lg={4}>
									<DealCard deal={deal} />
								</Grid>
							);
						})}
					</Grid>
				</TabPanel>
				<TabPanel value={value} index={1}>
					No Deals Found.
				</TabPanel>
				<TabPanel value={value} index={2}>
					No Deals Found.
				</TabPanel>
				<TabPanel value={value} index={3}>
					No Deals Found.
				</TabPanel>
				<TabPanel value={value} index={4}>
					No Deals Found.
				</TabPanel>
				{value === 0 && !isLodingAndFetchingData && (
					<Grid container justifyContent="end" sx={{ mt: 3 }}>
						<Grid item>
							<Pagination count={10} variant="outlined" shape="rounded" />
						</Grid>
					</Grid>
				)}
			</BasicLayout>
		</>
	);
};

export default Dashboard;
