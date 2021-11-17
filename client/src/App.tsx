import { FC, useEffect } from "react";
import { Router } from "@reach/router";
import { useMoralis } from "react-moralis";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";

const App: FC = () => {
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
