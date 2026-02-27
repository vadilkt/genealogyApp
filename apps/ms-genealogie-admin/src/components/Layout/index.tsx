import React from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header style={{ backgroundColor: '#1a365d', color: '#fff', padding: '1rem 2rem' }}>
                <nav>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>MS Généalogie Admin</span>
                </nav>
            </header>
            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
