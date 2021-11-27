/* eslint-disable react/jsx-props-no-spreading */
import { FC, SyntheticEvent, useState, useMemo, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useTable } from "react-table";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CircularProgress from "@mui/material/CircularProgress";
import BasicLayout from "../../layout/BasicLayout";
import { useGlobalContext } from "../../context/GlobalContext";

const Wallet: FC<RouteComponentProps> = () => {
	const Web3Api = useMoralisWeb3Api();
	const { chain, walletAddress } = useGlobalContext();
	const [tab, setTab] = useState<number>(1);

	/**
	 * @description Fetch Token Balance of User Address
	 */
	const {
		fetch: fetchTokenBalances,
		data: tokenBalancesData,
		// error: tokenBalancesError,
		isLoading: isTokenBalancesLoading,
		isFetching: isTokenBalancesFetching,
	} = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
		chain,
		address: walletAddress,
	});

	/**
	 * @description Fetch Historical Transaction of User Address
	 */
	const {
		fetch: fetchHistoricalTransaction,
		data: historicalTransactionData,
		// error: historicalTransactionError,
		isLoading: isHistoricalTransactionLoading,
		isFetching: isHistoricalTransactionFetching,
	} = useMoralisWeb3ApiCall(Web3Api.account.getTransactions, {
		chain,
		address: walletAddress,
		limit: 10,
	});

	/**
	 * @description Determine whether the component is fetching Web3 Data
	 */
	const isLoading = useMemo(
		() =>
			isTokenBalancesFetching ||
			isTokenBalancesLoading ||
			isHistoricalTransactionFetching ||
			isHistoricalTransactionLoading,
		[
			isTokenBalancesFetching,
			isTokenBalancesLoading,
			isHistoricalTransactionFetching,
			isHistoricalTransactionLoading,
		],
	);

	const { columns, data } = useMemo(() => {
		switch (tab) {
			case 0:
				return {
					columns: [
						{
							Header: "Name",
							accessor: "name", // accessor is the "key" in the data
						},
						{
							Header: "Symbol",
							accessor: "symbol",
						},
						{
							Header: "Balance",
							accessor: "balance",
						},
					],
					data: tokenBalancesData ?? [],
				};
			case 1:
				return {
					columns: [
						{
							Header: "Transaction Hash",
							accessor: "hash",
						},
						{
							Header: "From",
							accessor: "from_address",
						},
						{
							Header: "To",
							accessor: "to_address",
						},
					],
					data: historicalTransactionData?.result ?? [],
				};
			default:
				return {
					columns: [],
					data: [],
				};
		}
	}, [tab, tokenBalancesData, historicalTransactionData]);

	/* React Table */
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		// eslint-disable-next-line
		// @ts-ignore
		useTable({ columns, data });

	/**
	 * @description Handle Changes of Tab
	 *
	 * @param newValue - The new tab value
	 */
	const handleChange = (_: SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};

	useEffect(() => {
		switch (tab) {
			case 0:
				fetchTokenBalances();
				break;
			case 1:
				fetchHistoricalTransaction();
				break;
			default:
				break;
		}
		// eslint-disable-next-line
	}, [tab]);

	return (
		<BasicLayout
			title="Wallet"
			buttonText="Buy Crypto"
			buttonOnClick={() => {}}
			cardsArray={[{ title: "Balance", subtitle: "$ 1.3 B" }]}
		>
			<Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
				<Tab label="Portfolio" />
				<Tab label="Historical Transaction" />
			</Tabs>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				sx={{
					pt: 2,
				}}
			>
				<Grid item xs={12}>
					{isLoading ? (
						<CircularProgress color="primary" />
					) : (
						<TableContainer component={Paper}>
							<Table {...getTableProps()}>
								<TableHead>
									{headerGroups.map((headerGroup) => (
										<TableRow {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column) => (
												<TableCell {...column.getHeaderProps()}>
													{column.render("Header")}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableHead>
								<TableBody {...getTableBodyProps()}>
									{rows.map((row) => {
										prepareRow(row);
										return (
											<TableRow {...row.getRowProps()}>
												{row.cells.map((cell) => {
													return (
														<TableCell {...cell.getCellProps()}>
															{cell.render("Cell")}
														</TableCell>
													);
												})}
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Grid>
			</Grid>
		</BasicLayout>
	);
};

export default Wallet;
