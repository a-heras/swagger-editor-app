export type HttpMethod =
    'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'trace';

export type SchemaFormat = 'json' | 'yaml';

export type OpenApiDocument = {
    openapi?: string;
    swagger?: string;
    info?: unknown;
    paths?: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
};

export type OpenApiOperation = {
    summary?: string;
    description?: string;
    parameters?: OpenApiParameter[];
    requestBody?: unknown;
    responses?: Record<string, unknown>;
};

export type OpenApiParameter = {
    name?: string;
    in?: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    schema?: unknown;
    description?: string;
};

export type ApiEndpoint = {
    id: string;
    path: string;
    method: HttpMethod;
    summary?: string;
    description?: string;
    parameters: OpenApiParameter[];
    requestBody?: unknown;
    responses: Record<string, unknown>;
};

export type ParsedSchemaResult =
    | {
          ok: true;
          format: SchemaFormat;
          document: OpenApiDocument;
      }
    | {
          ok: false;
          format?: SchemaFormat;
          error: string;
      };
