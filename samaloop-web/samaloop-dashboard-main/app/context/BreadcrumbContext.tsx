'use client';

import { createContext, useContext, ReactNode, useState, useMemo } from 'react';

type breadcrumbContextType = {
    breadcrumbValue: any;
    breadcrumbStore: (value: any) => void;
};

const breadcrumbContextDefaultValues: breadcrumbContextType = {
    breadcrumbValue: null,
    breadcrumbStore: (value: any) => { },
};

const BreadcrumbContext = createContext<breadcrumbContextType>(breadcrumbContextDefaultValues);

export function useBreadcrumb() {
    return useContext(BreadcrumbContext);
}

type Props = {
    children: ReactNode;
};

export function BreadcrumbProvider({ children }: Readonly<Props>) {
    const [breadcrumbValue, setBreadcrumbValue] = useState<any>(null);

    const breadcrumbStore = (value: any) => {
        setBreadcrumbValue(value);
    };

    const value = useMemo(() => ({
        breadcrumbValue,
        breadcrumbStore
    }), [breadcrumbValue, breadcrumbStore]);

    return (
        <BreadcrumbContext.Provider value={value}>
            {children}
        </BreadcrumbContext.Provider>
    );
}