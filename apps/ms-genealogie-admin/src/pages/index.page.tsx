import type { NextPage } from 'next';

import styles from '@/styles/Home.module.scss';

const AdminHomePage: NextPage = () => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>MS Généalogie — Administration</h1>
                <p className={styles.description}>Panneau d&apos;administration</p>
            </main>
        </div>
    );
};

export default AdminHomePage;
