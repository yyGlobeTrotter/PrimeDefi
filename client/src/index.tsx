import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";

const theme = createTheme({});

ReactDOM.render(
	<StrictMode>
		<ChakraProvider>
			<ThemeProvider theme={theme}>
				<MoralisProvider
					appId={process.env.REACT_APP_MORALIS_APP_ID ?? ""}
					serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ""}
				>
					<App />
				</MoralisProvider>
			</ThemeProvider>
		</ChakraProvider>
	</StrictMode>,
	document.getElementById("root"),
);
