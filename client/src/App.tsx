import { Router } from "@reach/router";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";

const App = (): JSX.Element => {
	return (
		<Router>
			<Login path="login" />
			<Dashboard path="/*" />
		</Router>
	);
};

export default App;
