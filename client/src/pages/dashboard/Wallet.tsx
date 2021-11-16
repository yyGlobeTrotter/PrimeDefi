import { RouteComponentProps } from "@reach/router";
import BasicLayout from "../../layout/BasicLayout";

// eslint-disable-next-line
const Wallet = (_props: RouteComponentProps): JSX.Element => {
	return <BasicLayout title="Wallet" buttonText="Buy Crypto" />;
};

export default Wallet;
