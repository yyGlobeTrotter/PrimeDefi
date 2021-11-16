import { RouteComponentProps } from "@reach/router";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Modal from "@mui/material/Modal";

/* eslint react/jsx-curly-brace-presence: 0 */
// eslint-disable-next-line
const RegisterModal = (_props: RouteComponentProps): JSX.Element => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [creditRating, setCreditRating] = useState("A");

	const handleChange = (event: SelectChangeEvent) => {
        console.log(event);
		setCreditRating(event.target.value as string);
	};

	return (
		<>
			<Button
				onClick={handleOpen}
				sx={{
					marginRight: "0.75rem",
					backgroundColor: "#38A169",
					color: "white",
				}}
			>
				YES
			</Button>
			{open ? (
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 450,
							height: 650,
							bgcolor: "background.paper",
							border: "2px solid #000",
							boxShadow: 24,
							p: 4,
						}}
					>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
							sx={{ marginBottom: 2 }}
						>
							REGISTER WALLET
						</Typography>
						<TextField
							required
							id="full-name"
							label="Full Name"
							fullWidth
							sx={{ marginBottom: 2 }}
						/>
						<FormControl fullWidth>
							<InputLabel id="credit-rating-select-label">
								Credit Rating
							</InputLabel>
							<Select
								labelId="credit-rating-label"
								id="credit-rating-select"
								value={creditRating}
								label="Credit Rating"
								onChange={handleChange}
							>
								<MenuItem value={"A"}>A</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Modal>
			) : null}
		</>
	);
};

export default RegisterModal;
