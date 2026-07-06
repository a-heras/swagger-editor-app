export function generateCurlCommand(options: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
}) {
    const parts = [`curl -X ${options.method.toUpperCase()} '${options.url}'`];

    for (const [key, value] of Object.entries(options.headers)) {
        parts.push(`-H '${key}: ${value.replace(/'/g, "'\\''")}'`);
    }

    if (
        options.body &&
        methodSupportsBodyForCurl(options.method) &&
        options.body.length > 0
    ) {
        parts.push(`-d '${options.body.replace(/'/g, "'\\''")}'`);
    }

    return parts.join(' \\\n  ');
}

function methodSupportsBodyForCurl(method: string) {
    return !['GET', 'HEAD'].includes(method.toUpperCase());
}
