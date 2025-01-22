import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/settings(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {

    const { redirectToSignIn, userId } = auth();

    if (!userId && isProtectedRoute(context.request)) {
        // Add custom logic to run before redirecting

        return redirectToSignIn({
            returnBackUrl: context.request.url,
            
        });
    }
}, {
    publishableKey: import.meta.env.CLERK_PUBLISHABLE_KEY,
    secretKey: import.meta.env.CLERK_SECRET_KEY,
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
});
