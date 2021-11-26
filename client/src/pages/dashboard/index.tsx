import { FC, useEffect } from "react";
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
import Deal from "./issuer/Deal";
import Bidding from "./investor/Bidding";
import Holdings from "./investor/Holdings";
import AppBar from "../../components/AppBar";

const drawerWidth = 240;

const Index: FC<RouteComponentProps> = () => {
	const { isAuthenticated } = useMoralis();
	const { pathname } = useLocation();

	useEffect(() => {
		if (isAuthenticated) {
			if (pathname === "/") {
				navigate("/dashboard");
			}
		} else {
			navigate("/login");
		}
	}, [isAuthenticated, pathname]);

	// mulai dari appbar
	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar pathname={pathname} />
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
					<Deal path="deal/*" />
					<Bidding path="bidding" />
					<Holdings path="holdings" />
				</Router>
			</Box>
		</Box>
	);
};

export default Index;
