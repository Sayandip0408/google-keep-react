import { createContext, useContext, useEffect, useState } from "react";
import { _auth } from "../config/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";

const defaultContext = createContext({
    authUser: null,
    isLoading: true,
    isDark: localStorage.getItem('Theme') === 'true',
})

export default function useFirebaseAuth() {
    const [isDark, setIsDark] = useState(
        localStorage.getItem('Theme') === 'true'
    );
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = () => {
        setAuthUser(null);
        setIsLoading(false);
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        setAuthUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
        });
        setIsLoading(false);
    };

    const signOut = () => {
        authSignOut(_auth).then(() => clear());
    };

    const toggleThemeStatus = () => {
        const newThemeStatus = !isDark;
        setIsDark(newThemeStatus);
        localStorage.setItem('Theme', String(newThemeStatus));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(_auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        isDark,
        authUser,
        isLoading,
        signOut,
        toggleThemeStatus,
        setAuthUser,
    };
};

export const ContextProvider = ({ children }) => {
    const auth = useFirebaseAuth();
    return (
        <defaultContext.Provider value={auth}>
            {children}
        </defaultContext.Provider>
    );
};

export const useDefaultContext = () => {
    return useContext(defaultContext);
};
