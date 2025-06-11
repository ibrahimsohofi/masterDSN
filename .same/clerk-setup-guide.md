# Clerk Authentication Setup Guide

## Current Status
✅ Application is running with Clerk temporarily disabled
⚠️ Authentication features are not functional until Clerk is properly configured

## How to Enable Clerk Authentication

### 1. Create Clerk Account
1. Go to [https://clerk.dev](https://clerk.dev)
2. Sign up for a free account
3. Create a new application

### 2. Get Your Clerk Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable Key" and "Secret Key"

### 3. Update Environment Variables
Replace the placeholder values in `.env.local`:

```env
# Replace these with your actual Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
CLERK_SECRET_KEY=sk_test_your_actual_secret_key
```

### 4. Re-enable Clerk Components
Once you have valid keys, restore the original components:

#### A. Restore Layout (src/app/layout.tsx)
```typescript
// Uncomment these imports:
import Navigation from "@/components/Navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Replace NavigationTemp with Navigation
// Wrap the return in ClerkProvider again
```

#### B. Restore Middleware (middleware.ts)
```typescript
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 5. Test Authentication
1. Restart the development server
2. Click "Se connecter" to test sign-in flow
3. Click "Inscription" to test sign-up flow

## Features That Will Work After Setup
- ✅ User authentication (sign in/sign up)
- ✅ Protected routes (dashboard, deposit, etc.)
- ✅ Role-based navigation (student vs teacher)
- ✅ User profile management
- ✅ Automatic redirects to onboarding for new users

## Database Setup
The application also uses Prisma with SQLite. To set up the database:
```bash
cd masterDSN
bun run prisma:migrate
bun run prisma:generate
```

## Current Temporary Files
These files can be deleted once Clerk is properly set up:
- `src/components/Navigation-temp.tsx`
- `src/app/layout-temp.tsx`
