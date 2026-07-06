import { describe, expect, it } from 'vitest';

import { isPrivateRoute } from './private-routes';

describe('isPrivateRoute', () => {
    it('matches history routes', () => {
        expect(isPrivateRoute('/history')).toBe(true);
        expect(isPrivateRoute('/history/abc-123')).toBe(true);
    });

    it('does not match public routes', () => {
        expect(isPrivateRoute('/')).toBe(false);
        expect(isPrivateRoute('/about')).toBe(false);
        expect(isPrivateRoute('/history-page')).toBe(false);
    });
});
