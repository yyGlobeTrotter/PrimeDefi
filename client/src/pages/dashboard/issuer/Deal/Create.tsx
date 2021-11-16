import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import Grid from "@mui/material/Grid";
import Input from "../../../../components/Input";
import BasicLayout from "../../../../layout/BasicLayout";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../../list/createDeal";

const CreateDeal: FC<RouteComponentProps> = () => {
	return (
		<BasicLayout title="Create Deal" spacing={3}>
			<Grid container spacing={3}>
				{createDealTextFields.map((field: CreateDealTextFieldsType) => {
					const {
						title,
						name,
						disabled,
						subtitle,
						placeholder,
						xs,
						sm,
						md,
						lg,
						xl,
					} = field;
					return (
						<Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
							<Input
								title={title}
								name={name}
								disabled={disabled}
								subtitle={subtitle}
								placeholder={placeholder}
							/>
						</Grid>
					);
				})}
			</Grid>
		</BasicLayout>
	);
};

export default CreateDeal;
