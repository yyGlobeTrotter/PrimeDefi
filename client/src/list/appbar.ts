import { MdDashboard } from "react-icons/md";
import { FaWallet, FaMoneyBillWaveAlt } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import ROLES from "../global.types";

export interface AppBarMenuContentType {
	id: string;
	name: string;
	link: string;
	icon: IconType;
}

export interface AppBarMenuOptionType {
	role: ROLES;
	menu: Array<AppBarMenuContentType>;
}

const appbarMenu: Array<AppBarMenuOptionType> = [
	{
		role: ROLES.ISSUER,
		menu: [
			{
				id: "dashboard",
				name: "Dashboard",
				link: "/dashboard",
				icon: MdDashboard,
			},
			{
				id: "wallet",
				name: "Wallet",
				link: "/wallet",
				icon: FaWallet,
			},
		],
	},
	{
		role: ROLES.INVESTOR,
		menu: [
			{
				id: "dashboard",
				name: "Dashboard",
				link: "/dashboard",
				icon: MdDashboard,
			},
			{
				id: "holdings",
				name: "Holdings",
				link: "/holdings",
				icon: FaMoneyBillWaveAlt,
			},
			{
				id: "wallet",
				name: "Wallet",
				link: "/wallet",
				icon: FaWallet,
			},
		],
	},
];

export default appbarMenu;
