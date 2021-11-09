import { Text, Input } from "@chakra-ui/react";

interface CustomInputProps {
	title: string | number;
	disabled?: boolean;
	subtitle?: string | number;
	placeholder?: string;
}

const CustomInput = (props: CustomInputProps): JSX.Element => {
	const { title, disabled = false, subtitle = "", placeholder = "" } = props;

	return (
		<>
			<Text>{title}</Text>
			<Input disabled={disabled} placeholder={placeholder} />
			<Text>{subtitle}</Text>
		</>
	);
};

export default CustomInput;
