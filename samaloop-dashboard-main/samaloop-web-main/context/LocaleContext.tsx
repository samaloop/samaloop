'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface LocaleContextProps {
    locale: string;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

interface LocaleProviderProps {
    children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
    const pathname = usePathname();
    const defaultLocale = 'id';
    const locales = ['en', 'id'];
    const locale = locales.find((loc) => pathname.startsWith(`/${loc}`)) ?? defaultLocale;

    const value = useMemo(() => ({ locale }), [locale]);

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = (): LocaleContextProps => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
