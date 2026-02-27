// Application-level utilities
export const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);
