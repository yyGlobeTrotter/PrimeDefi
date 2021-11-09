import { RouteComponentProps } from "@reach/router";
import { SimpleGrid, Box } from "@chakra-ui/react";
import Input from "../../../components/Input";
import createDealTextFields, {
	CreateDealTextFieldsType,
} from "../../../list/createDeal";

// eslint-disable-next-line
const CreateDeal = (_props: RouteComponentProps): JSX.Element => {
	return (
		<SimpleGrid minChildWidth="200px" spacing="40px">
			{createDealTextFields.map((field: CreateDealTextFieldsType) => {
				const { title } = field;
				return (
					<Box height="80px">
						<Input title={title} />
					</Box>
				);
			})}
		</SimpleGrid>
	);
};

export default CreateDeal;
