import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import BasicLayout from "../../layout/BasicLayout";

const Wallet: FC<RouteComponentProps> = () => {
	return (
		<BasicLayout
			title="Wallet"
			buttonText="Buy Crypto"
			cardsArray={[{ title: "Balance", subtitle: "$ 1.3 B" }]}
		/>
	);
};

export default Wallet;
