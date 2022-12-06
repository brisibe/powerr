import { createContext, useState } from "react";
const utils = {
    overlayLoading: false,
    isFridgeOn: false

}
const UtilsContext = createContext({});

export const UtilsContextProvider = ({children}) => {
   const [util, setUtil] = useState(utils);

    return <UtilsContext.Provider value={{util, setUtil}}>
        {children}
    </UtilsContext.Provider>
}

export default UtilsContext;


