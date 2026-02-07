'use client';

import { createContext, useContext, ReactNode, useState, useMemo } from 'react';

type authContextType = {
    userValue: any;
    userStore: (value: any) => void;
};

const authContextDefaultValues: authContextType = {
    userValue: null,
    userStore: (value: any) => { },
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Readonly<Props>) {
    const [userValue, setUserValue] = useState<any>(null);

    const userStore = (value: any) => {
        setUserValue(value);
    };

    const value = useMemo(() => ({
        userValue,
        userStore
    }), [userValue, userStore]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}