import queryString from 'query-string';

export const parseQueryString = (url: string) => {
    return queryString.parse(url);
};

export const stringifyQueryParams = (params: Record<string, unknown>) => {
    return queryString.stringify(params as Record<string, string>, {
        skipNull: true,
        skipEmptyString: true,
    });
};

export const buildUrl = (baseUrl: string, params: Record<string, unknown>): string => {
    const qs = stringifyQueryParams(params);
    return qs ? `${baseUrl}?${qs}` : baseUrl;
};

export { queryString };
