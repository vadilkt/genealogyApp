import type { ReactNode } from 'react';

import styles from './Layout.module.scss';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <span className={styles.logo}>MS Généalogie</span>
                </nav>
            </header>
            <main className={styles.content}>{children}</main>
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} MS Généalogie</p>
            </footer>
        </div>
    );
};

export default Layout;
