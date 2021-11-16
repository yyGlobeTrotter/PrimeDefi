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
}

const CustomInput: FC<CustomInputProps> = (props) => {
	const {
		title,
		name,
		disabled = false,
		subtitle = "",
		placeholder = "",
		type = "",
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
				/>
			</Grid>
			<Grid item>
				<Typography>{subtitle}</Typography>
			</Grid>
		</Grid>
	);
};

export default CustomInput;
