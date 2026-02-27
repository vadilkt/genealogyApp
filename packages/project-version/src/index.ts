export interface ProjectVersion {
    name: string;
    version: string;
    buildDate: string;
    gitCommit?: string;
    environment: string;
}

export const getProjectVersion = (): ProjectVersion => {
    return {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'ms-genealogie',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
        buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
        gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT,
        environment: process.env.NODE_ENV || 'development',
    };
};

export const formatVersion = (version: ProjectVersion): string => {
    const parts = [`v${version.version}`];
    if (version.gitCommit) {
        parts.push(`(${version.gitCommit.substring(0, 7)})`);
    }
    return parts.join(' ');
};
