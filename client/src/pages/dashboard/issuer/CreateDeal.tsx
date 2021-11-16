import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import Grid from "@mui/material/Grid";
import Input from "../../../components/Input";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../list/createDeal";

const CreateDeal: FC<RouteComponentProps> = () => {
	return (
		<Grid container spacing={3}>
			{createDealTextFields.map((field: CreateDealTextFieldsType) => {
				const { title, disabled, subtitle, placeholder, xs, sm, md, lg, xl } =
					field;
				return (
					<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
						<Input
							title={title}
							disabled={disabled}
							subtitle={subtitle}
							placeholder={placeholder}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default CreateDeal;
