# 🏗️ **API Architecture Guide**

## ✅ **Correct RESTful API Structure**

```
src/app/api/
├── auth/
│   ├── login/route.ts        # POST /api/auth/login
│   ├── logout/route.ts       # POST /api/auth/logout
│   └── session/route.ts      # GET /api/auth/session
├── profiles/
│   ├── route.ts              # GET /api/profiles, POST /api/profiles
│   └── [id]/
│       └── route.ts          # GET /api/profiles/[id], PUT /api/profiles/[id], DELETE /api/profiles/[id]
├── users/
│   ├── route.ts              # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts          # GET /api/users/[id], PUT /api/users/[id], DELETE /api/users/[id]
└── health/
    └── route.ts              # GET /api/health
```

## 🚫 **What NOT to Do**

### ❌ **Non-RESTful Routes:**
- `/api/profile/ensure` - Use POST /api/profiles instead
- `/api/profile/create` - Use POST /api/profiles instead
- `/api/profile/update` - Use PUT /api/profiles/[id] instead

### ❌ **Mixed Patterns:**
- Don't mix server actions with API routes for the same functionality
- Don't create custom endpoints when RESTful ones exist

## ✅ **RESTful Conventions**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles` | List all profiles |
| POST | `/api/profiles` | Create new profile |
| GET | `/api/profiles/[id]` | Get specific profile |
| PUT | `/api/profiles/[id]` | Update specific profile |
| DELETE | `/api/profiles/[id]` | Delete specific profile |

## 🔄 **Data Flow**

1. **Page Component** → Fetches data from API routes
2. **API Routes** → Handle business logic and database operations
3. **Server Actions** → Only for form submissions and mutations
4. **Client Components** → Handle UI state and user interactions

## 📁 **File Organization**

```
src/
├── app/
│   ├── api/                 # API routes only
│   ├── (auth)/             # Auth pages
│   ├── profile/            # Profile pages
│   └── globals.css
├── lib/
│   ├── actions/            # Server actions
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── validation/         # Zod schemas
└── components/
    ├── ui/                 # Reusable UI components
    └── forms/              # Form components
```
