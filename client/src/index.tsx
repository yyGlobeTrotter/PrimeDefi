import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

ReactDOM.render(
	<StrictMode>
		<ChakraProvider>
			<MoralisProvider
				appId={process.env.REACT_APP_MORALIS_APP_ID ?? ""}
				serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ""}
			>
				<App />
			</MoralisProvider>
		</ChakraProvider>
	</StrictMode>,
	document.getElementById("root"),
);
