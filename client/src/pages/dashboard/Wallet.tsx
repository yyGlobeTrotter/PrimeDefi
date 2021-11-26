import { FC, SyntheticEvent, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BasicLayout from "../../layout/BasicLayout";
import { useGlobalContext } from "../../context/GlobalContext";

const Wallet: FC<RouteComponentProps> = () => {
	const Web3Api = useMoralisWeb3Api();
	const { chain, walletAddress } = useGlobalContext();
	const [tab, setTab] = useState<number>(0);

	const {
		fetch: fetchTokenBalances,
		data: tokenBalancesData,
		error: tokenBalancesError,
		isLoading: isTokenBalancesLoading,
	} = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
		chain,
		address: walletAddress,
	});

	const {
		fetch: fetchHistoricalTransaction,
		data: historicalTransaction,
		error: historicalTransactionError,
		isLoading: isHistoricalTransactionLoading,
	} = useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
		chain,
		address: walletAddress,
	});

	/**
	 * @description Handle Changes of Tab
	 *
	 * @param newValue - The new tab value
	 */
	const handleChange = (_: SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};

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
		</BasicLayout>
	);
};

export default Wallet;
