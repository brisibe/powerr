import localforage from 'localforage';
import {createContext, useEffect, useState} from 'react'

const userContext = createContext({});

const userState = {
    isLoggedId: false,
    currentUser: null
}

const cachedUser = JSON.parse(window.sessionStorage.getItem('user'));
// console.log(cachedUser, 'cache')

export const UserContextProvider = ({children}) => {
    const [userStateVal, setUserStateVal] = useState(cachedUser !== null ? cachedUser: userState);

    return <userContext.Provider value={{userStateVal, setUserStateVal}}>
        {children}
    </userContext.Provider>
}

export default userContext;