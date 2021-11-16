import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import ViewDeal from "./View";
import CreateDeal from "./Create";
import UpdateDeal from "./Update";

const DealIndex: FC<RouteComponentProps> = () => {
	return (
		<>
			<ViewDeal path="/view/:dealId" />
			<CreateDeal path="/create" />
			<UpdateDeal path="/update:dealId" />
		</>
	);
};

export default DealIndex;
