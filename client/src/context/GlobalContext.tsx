import { FC, createContext, useState, useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import { CHAIN } from "../global.types";

export const GlobalContext = createContext<{
	chain: CHAIN;
	walletAddress: string;
}>({
	chain: CHAIN.MAINNET,
	walletAddress: "",
});

const GlobalContextProvider: FC = (props) => {
	const { children } = props;
	const { web3, user, Moralis } = useMoralis();
	const [chain, setChain] = useState<CHAIN>(CHAIN.MAINNET);
	const [walletAddress, setWalletAddress] = useState<string>("");

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Moralis.onChainChanged((chainRes) => {
			setChain(chainRes);
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Moralis.onAccountsChanged((address) => {
			setWalletAddress(address[0]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => setChain(web3?.givenProvider?.chainId));
	useEffect(
		() =>
			setWalletAddress(
				web3?.givenProvider?.selectedAddress || user?.get("ethAddress"),
			),
		[web3, user],
	);

	return (
		<GlobalContext.Provider value={{ chain, walletAddress }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext: () => {
	chain: CHAIN;
	walletAddress: string;
} = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error(
			"Global Context must be called within GlobalContextProvider!",
		);
	}

	return context;
};

export default GlobalContextProvider;
