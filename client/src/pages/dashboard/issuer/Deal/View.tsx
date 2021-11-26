import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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

	return (
		<>
			<Typography>EVERRE 8.25 03/23/22</Typography>
			<Typography>Credit Suisse</Typography>
			<Button>Update Deal</Button>
			<Button>Cancel Deal</Button>
		</>
	);
};

export default ViewDeal;
