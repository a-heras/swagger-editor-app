import { NextResponse, type NextRequest } from 'next/server';

import { isPrivateRoute } from '@/lib/auth/private-routes';
import { updateSession } from '@/lib/supabase/middleware';

function isDocumentNavigation(request: NextRequest) {
    const fetchDest = request.headers.get('sec-fetch-dest');

    if (fetchDest === 'document') {
        return true;
    }

    const accept = request.headers.get('accept') ?? '';
    return accept.includes('text/html');
}

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    if (!user && isPrivateRoute(request.nextUrl.pathname)) {
        if (isDocumentNavigation(request)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.json(
            {
                error: 'Unauthorized',
                message: 'Authentication required.',
            },
            { status: 401 },
        );
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
