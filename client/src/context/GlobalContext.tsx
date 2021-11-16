import { FC, createContext } from "react";

export const GlobalContext = createContext({});

const GlobalContextProvider: FC = (props) => {
	const { children } = props;

	return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};

export default GlobalContextProvider;
