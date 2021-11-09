import { useMemo } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { navigate } from "@reach/router";
import AppBarList, {
	AppBarMenuContentType,
	AppBarMenuOptionType,
} from "../../list/appbar";

const InnerDrawer = (): JSX.Element => {
	const ROLE = "INVESTOR";
	const AppBarListByRole = useMemo(
		() =>
			AppBarList.find(
				(option: AppBarMenuOptionType) => option.role === ROLE,
			) ?? { menu: [] },
		[ROLE],
	);

	return (
		<>
			<Toolbar />
			<Divider />
			<List>
				{AppBarListByRole.menu.map((menu: AppBarMenuContentType) => {
					const { id, name, link, icon: Icon } = menu;
					return (
						<ListItem button key={id} onClick={() => navigate(link)}>
							<ListItemIcon>
								<Icon size="1.5em" />
							</ListItemIcon>
							<ListItemText primary={name} />
						</ListItem>
					);
				})}
			</List>
		</>
	);
};

export default InnerDrawer;
