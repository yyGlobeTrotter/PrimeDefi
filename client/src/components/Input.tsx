import { FC } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

interface CustomInputProps {
	title: string | number;
	name: string;
	disabled?: boolean;
	subtitle?: string | number;
	placeholder?: string;
	type?: string;
	value: string;
	onChange: (e: any) => void;
}

const CustomInput: FC<CustomInputProps> = (props) => {
	const {
		title,
		name,
		disabled = false,
		subtitle = "",
		placeholder = "",
		type = "",
		value = "",
		onChange,
	} = props;

	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography color="text.secondary">
					<b>{title}</b>
				</Typography>
			</Grid>
			<Grid item>
				<TextField
					name={name}
					fullWidth
					disabled={disabled}
					placeholder={placeholder}
					size="small"
					type={type}
					value={value}
					onChange={onChange}
				/>
			</Grid>
			<Grid item>
				<Typography>{subtitle}</Typography>
			</Grid>
		</Grid>
	);
};

export default CustomInput;
