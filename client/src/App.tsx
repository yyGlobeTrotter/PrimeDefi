import { useEffect } from "react";
import { Router } from "@reach/router";
import { useMoralis } from "react-moralis";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard";

const App = (): JSX.Element => {
	const { isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } =
		useMoralis();

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
			enableWeb3();
		}
		// eslint-disable-next-line
	}, [isAuthenticated, isWeb3Enabled]);

	return (
		<Router>
			<Login path="login" />
			<Dashboard path="/*" />
		</Router>
	);
};

export default App;
