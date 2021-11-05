import { createContext } from "react";

interface GlobalContextProps {
	children: JSX.Element;
}

export const GlobalContext = createContext({});

const GlobalContextProvider = (props: GlobalContextProps): JSX.Element => {
	const { children } = props;

	return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};

export default GlobalContextProvider;
