export type HttpMethod =
    'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head' | 'trace';

export type SchemaFormat = 'json' | 'yaml';

export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export type OpenApiSchema = {
    type?: string;
    format?: string;
    properties?: Record<string, OpenApiSchema>;
    items?: OpenApiSchema;
    required?: string[];
    example?: unknown;
    examples?: Record<string, { value?: unknown }>;
    $ref?: string;
    description?: string;
    enum?: unknown[];
    default?: unknown;
};

export type OpenApiMediaType = {
    schema?: OpenApiSchema;
    example?: unknown;
    examples?: Record<string, { value?: unknown; summary?: string }>;
};

export type OpenApiRequestBody = {
    description?: string;
    required?: boolean;
    content?: Record<string, OpenApiMediaType>;
};

export type OpenApiResponse = {
    description?: string;
    content?: Record<string, OpenApiMediaType>;
};

export type OpenApiParameter = {
    name?: string;
    in?: ParameterLocation;
    required?: boolean;
    schema?: OpenApiSchema;
    description?: string;
    example?: unknown;
};

export type OpenApiServer = {
    url: string;
    description?: string;
};

export type OpenApiDocument = {
    openapi?: string;
    swagger?: string;
    info?: unknown;
    servers?: OpenApiServer[];
    host?: string;
    basePath?: string;
    schemes?: string[];
    paths?: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
};

export type OpenApiOperation = {
    summary?: string;
    description?: string;
    parameters?: OpenApiParameter[];
    requestBody?: OpenApiRequestBody;
    responses?: Record<string, OpenApiResponse>;
};

export type ApiEndpoint = {
    id: string;
    path: string;
    method: HttpMethod;
    summary?: string;
    description?: string;
    parameters: OpenApiParameter[];
    requestBody?: OpenApiRequestBody;
    responses: Record<string, OpenApiResponse>;
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
