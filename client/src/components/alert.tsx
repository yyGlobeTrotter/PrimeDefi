import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";

/* eslint react/jsx-props-no-spreading: 0 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default Alert;