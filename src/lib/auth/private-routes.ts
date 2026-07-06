const PRIVATE_ROUTE_PREFIXES = ['/history'] as const;

export function isPrivateRoute(pathname: string) {
    return PRIVATE_ROUTE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}
