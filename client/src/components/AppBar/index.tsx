import { FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useMoralis } from "react-moralis";
import InnerDrawer from "./InnerDrawer";

const drawerWidth = 240;

interface AppBarIndexProps {
	pathname: string;
}

const AppBarIndex: FC<AppBarIndexProps> = (props) => {
	const { pathname } = props;
	const { logout, user } = useMoralis();
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);

	/**
	 * @description Handle open/close mobile `Drawer` component
	 */
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	/**
	 * @description Handle disconnecting web3 wallet
	 */
	const onLogout = async () => {
		try {
			await logout();
		} catch (e) {
			// Should be replaced by error snackbar
			// eslint-disable-next-line
			console.error(e);
		}
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Grid container alignItems="center">
						<Grid item>
							<Typography variant="h6" noWrap component="div">
								PrimeDeFi
							</Typography>
						</Grid>
					</Grid>
					<Button color="inherit" variant="outlined" onClick={onLogout}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					<InnerDrawer pathname={pathname} isInvestor={user?.attributes.isInvestor}/>
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					<InnerDrawer pathname={pathname} isInvestor={user?.attributes.isInvestor}/>
				</Drawer>
			</Box>
		</>
	);
};

export default AppBarIndex;
