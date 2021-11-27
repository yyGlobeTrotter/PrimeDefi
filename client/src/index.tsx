import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import GlobalContextProvider from "./context/GlobalContext";

const theme = createTheme({});

ReactDOM.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<MoralisProvider
				appId={process.env.REACT_APP_MORALIS_APP_ID ?? ""}
				serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ""}
			>
				<GlobalContextProvider>
					<App />
				</GlobalContextProvider>
			</MoralisProvider>
		</ThemeProvider>
	</StrictMode>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
