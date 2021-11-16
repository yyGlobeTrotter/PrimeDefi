import { FC } from "react";
import { RouteComponentProps } from "@reach/router";

interface UpdateDealProps extends RouteComponentProps {
	dealId?: number;
}

const UpdateDeal: FC<UpdateDealProps> = () => {
	// const { dealId } = props;

	// useEffect(() => {
	// 	if (!dealId) {
	// 		navigate("/dashboard");
	// 	}
	// 	// eslint-disable-next-line
	// }, []);

	return <></>;
};

export default UpdateDeal;
