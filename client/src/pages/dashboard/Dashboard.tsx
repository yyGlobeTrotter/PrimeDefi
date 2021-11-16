import { FC } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import BasicLayout from "../../layout/BasicLayout";

const Dashboard: FC<RouteComponentProps> = () => {
	return (
		<BasicLayout
			title="Dashboard"
			buttonText="Create Deal"
			buttonOnClick={() => navigate("/deal/create")}
			cardsArray={[
				{ title: "Total Value Raised", subtitle: "$ 350.2 M" },
				{ title: "Credit Rating", subtitle: "AA (Moody)" },
			]}
		/>
	);
};

export default Dashboard;
