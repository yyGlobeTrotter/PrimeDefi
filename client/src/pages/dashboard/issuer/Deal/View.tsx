import { FC } from "react";
import { RouteComponentProps } from "@reach/router";

interface ViewDealProps extends RouteComponentProps {
	dealId?: number;
}

const ViewDeal: FC<ViewDealProps> = () => {
	// const { dealId } = props;

	// useEffect(() => {
	// 	if (!dealId) {
	// 		navigate("/dashboard");
	// 	}
	// 	// eslint-disable-next-line
	// }, []);

	return <></>;
};

export default ViewDeal;
