import { Router, RouteComponentProps } from "@reach/router";
import Dashboard from "./Dashboard";
import Wallet from "./Wallet";
import CreateDeal from "./issuer/CreateDeal";
import Bidding from "./investor/Bidding";
import Holdings from "./investor/Holdings";

// eslint-disable-next-line
const Index = (_props: RouteComponentProps): JSX.Element => {
	return (
		<Router>
			<Dashboard path="dashboard" />
			<Wallet path="wallet" />
			<CreateDeal path="create-deal" />
			<Bidding path="bidding" />
			<Holdings path="holdings" />
		</Router>
	);
};

export default Index;
