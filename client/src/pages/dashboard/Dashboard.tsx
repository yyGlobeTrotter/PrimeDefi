import { RouteComponentProps } from "@reach/router";
import BasicLayout from "../../layout/BasicLayout";

// eslint-disable-next-line
const Dashboard = (_props: RouteComponentProps): JSX.Element => {
	return (
		<BasicLayout
			title="Dashboard"
			buttonText="Create Deal"
			cardsArray={[
				{ title: "Total Value Raised", subtitle: "$ 350.2 M" },
				{ title: "Credit Rating", subtitle: "AA (Moody)" },
			]}
		/>
	);
};

export default Dashboard;
