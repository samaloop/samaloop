import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useLocale } from '../context/LocaleContext';

interface LocalizedLinkProps extends LinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

const LocalizedLink: React.FC<LocalizedLinkProps> = ({ href, as, className, children, ...props }) => {
    const { locale } = useLocale();
    const localizedHref = locale === 'id' ? href : '/' + locale + href;

    return (
        <Link href={localizedHref} as={as} className={className} hrefLang={locale} {...props}>
            {children}
        </Link>
    );
};

export default LocalizedLink;