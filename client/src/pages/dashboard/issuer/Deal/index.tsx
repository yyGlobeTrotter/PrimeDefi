import { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import ViewDeal from "./View";
import CreateDeal from "./Create";
import UpdateDeal from "./Update";

const DealIndex: FC<RouteComponentProps> = () => {
	return (
		<Router>
			<ViewDeal path="/view/:dealId" />
			<CreateDeal path="/create" />
			<UpdateDeal path="/update/:dealId" />
		</Router>
	);
};

export default DealIndex;
