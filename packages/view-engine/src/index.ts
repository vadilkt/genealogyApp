import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export interface ViewConfig {
    entity: string;
    fields: string[];
    filters?: Record<string, unknown>;
    sort?: { field: string; order: 'ASC' | 'DESC' };
    pagination?: { page: number; pageSize: number };
}

export const buildQuery = (config: ViewConfig): string => {
    const queryObject: Record<string, unknown> = {
        query: {
            [config.entity]: {
                __args: {
                    ...(config.filters && { where: config.filters }),
                    ...(config.sort && {
                        orderBy: { [config.sort.field]: config.sort.order },
                    }),
                    ...(config.pagination && {
                        skip: (config.pagination.page - 1) * config.pagination.pageSize,
                        take: config.pagination.pageSize,
                    }),
                },
                ...config.fields.reduce(
                    (acc, field) => {
                        acc[field] = true;
                        return acc;
                    },
                    {} as Record<string, boolean>,
                ),
            },
        },
    };

    return jsonToGraphQLQuery(queryObject, { pretty: true });
};

export { jsonToGraphQLQuery };
