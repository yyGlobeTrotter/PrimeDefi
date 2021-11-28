/* eslint-disable react/jsx-props-no-spreading */
import { FC, useState, forwardRef, Ref, ReactElement } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useMoralis } from "react-moralis";
import { navigate } from "@reach/router";
import InnerDrawer from "./InnerDrawer";
import { useGlobalContext } from "../../context/GlobalContext";
import getEllipsisTxt from "../../helpers/formatter";

const drawerWidth = 240;

interface AppBarIndexProps {
	pathname: string;
}

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement<any, any>;
	},
	ref: Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const AppBarIndex: FC<AppBarIndexProps> = (props) => {
	const { pathname } = props;
	const { logout, user } = useMoralis();
	const { walletAddress } = useGlobalContext();
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

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
			navigate("/login");
		} catch (e) {
			// Should be replaced by error snackbar
			// eslint-disable-next-line
			console.error(e);
		}
	};

	return (
		<>
			<Dialog
				open={logoutModalOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setLogoutModalOpen(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>Disconnect Metamask</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Are you sure you would like to disconnect your Metamask from the
						PrimeDefi dApp?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setLogoutModalOpen(false)}
						variant="contained"
						color="error"
					>
						Cancel
					</Button>
					<Button onClick={onLogout}>Confirm</Button>
				</DialogActions>
			</Dialog>
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { md: "none" } }}
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
					<Grid container justifyContent="end" alignItems="center" spacing={2}>
						<Grid item>
							<Button
								color="inherit"
								variant="outlined"
								fullWidth
								onClick={() => setLogoutModalOpen(true)}
							>
								{getEllipsisTxt(walletAddress, 10)}
							</Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					<InnerDrawer
						pathname={pathname}
						isInvestor={user?.attributes.isInvestor}
					/>
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					<InnerDrawer
						pathname={pathname}
						isInvestor={user?.attributes.isInvestor}
					/>
				</Drawer>
			</Box>
		</>
	);
};

export default AppBarIndex;
