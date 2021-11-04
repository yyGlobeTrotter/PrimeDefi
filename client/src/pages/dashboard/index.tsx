import { Router, RouteComponentProps } from "@reach/router";
import Dashboard from "./Dashboard";
import Wallet from "./Wallet";

// eslint-disable-next-line
const Index = (_props: RouteComponentProps): JSX.Element => {
	return (
		<Router>
			<Dashboard path="dashboard" />
			<Wallet path="wallet" />
		</Router>
	);
};

export default Index;
