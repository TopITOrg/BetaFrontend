import { usePathname } from 'next/navigation';

export const useActivePath = () => {
    const pathname = usePathname();

    const getSelectedButton = () => {
        if (pathname === '/') return 0;
        if (pathname === '/news') return 1;
        if (pathname === '/clubs') return 2;
        return -1; // Для других страниц
    };

    return getSelectedButton();
};