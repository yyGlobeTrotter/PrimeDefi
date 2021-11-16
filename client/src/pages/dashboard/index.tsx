import { useEffect } from "react";
import {
	Router,
	RouteComponentProps,
	useLocation,
	navigate,
} from "@reach/router";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { useMoralis } from "react-moralis";
import Dashboard from "./Dashboard";
import Wallet from "./Wallet";
import CreateDeal from "./issuer/CreateDeal";
import Bidding from "./investor/Bidding";
import Holdings from "./investor/Holdings";
import AppBar from "../../components/AppBar";

const drawerWidth = 240;

// eslint-disable-next-line
const Index = (_props: RouteComponentProps): JSX.Element => {
	const { isAuthenticated } = useMoralis();
	const { pathname } = useLocation();

	useEffect(() => {
		if (isAuthenticated && pathname === "/") {
			navigate("/dashboard");
		}
	}, [isAuthenticated, pathname]);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 5,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar />
				<Router>
					<Dashboard path="dashboard" />
					<Wallet path="wallet" />
					<CreateDeal path="create-deal" />
					<Bidding path="bidding" />
					<Holdings path="holdings" />
				</Router>
			</Box>
		</Box>
	);
};

export default Index;
