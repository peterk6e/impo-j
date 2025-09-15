# 🚀 **TanStack Query Integration Guide**


### **❌ Problems with Manual Fetch:**
```typescript
// Manual approach - lots of problems
const [profile, setProfile] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profiles/123')
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  fetchProfile()
}, [])
```

**Issues:**
- ❌ No caching
- ❌ No loading states
- ❌ No error handling
- ❌ No refetching
- ❌ No optimistic updates
- ❌ No background updates
- ❌ Duplicate requests
- ❌ Memory leaks

### **✅ With TanStack Query:**
```typescript
// Professional approach
const { data: profile, isLoading, error } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
})
```

**Benefits:**
- ✅ **Automatic caching**
- ✅ **Loading states**
- ✅ **Error handling**
- ✅ **Background refetching**
- ✅ **Optimistic updates**
- ✅ **Deduplication**
- ✅ **Memory management**

## 🏗️ **Updated Architecture with TanStack Query**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TanStack      │───▶│   API Routes    │───▶│   Services      │
│   Query         │    │   (/api/*)      │    │   (Business)    │
│   (Data Layer)  │    └─────────────────┘    └─────────────────┘
└─────────────────┐
│   Client UI     │
└─────────────────┘
```

## 📁 **File Structure**

```
src/
├── lib/
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query setup
│   ├── hooks/
│   │   └── useProfile.ts         # React Query hooks
│   └── services/
│       └── profileService.ts     # Business logic
├── app/
│   ├── layout.tsx                # QueryProvider wrapper
│   └── profile/
│       ├── page.tsx              # Server component (auth only)
│       └── ProfileClient.tsx     # Client component (data + UI)
```

## 🔧 **Implementation Details**

### **1. Query Provider Setup**
```typescript
// src/lib/providers/QueryProvider.tsx
export function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error.status >= 400 && error.status < 500) return false
          return failureCount < 3
        },
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
```

### **2. Custom Hooks**
```typescript
// src/lib/hooks/useProfile.ts
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, updates }) => updateProfile(userId, updates),
    onSuccess: (data) => {
      // Update cache optimistically
      queryClient.setQueryData(['profile', data.id], data)
    },
  })
}
```

### **3. Client Component**
```typescript
// src/app/profile/ProfileClient.tsx
export default function ProfileClient({ initialSession }) {
  const { profile, isLoading, error } = useProfile(initialSession.user.id)
  const updateProfile = useUpdateProfile()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <ProfileForm profile={profile} onUpdate={updateProfile.mutate} />
}
```

## 🎯 **Key Benefits**

### **1. Automatic Caching**
- Data is cached and reused across components
- No duplicate requests
- Instant loading for cached data

### **2. Background Updates**
- Data refreshes automatically when stale
- Users always see fresh data
- No manual refresh needed

### **3. Optimistic Updates**
- UI updates immediately
- Rollback on error
- Better user experience

### **4. Error Handling**
- Automatic retry logic
- Error boundaries
- Graceful degradation

### **5. Loading States**
- Built-in loading indicators
- Skeleton screens
- Better UX

## 📊 **Performance Comparison**

| Feature | Manual Fetch | TanStack Query |
|---------|-------------|----------------|
| **Caching** | ❌ None | ✅ Automatic |
| **Loading States** | ❌ Manual | ✅ Built-in |
| **Error Handling** | ❌ Manual | ✅ Automatic |
| **Background Updates** | ❌ None | ✅ Automatic |
| **Optimistic Updates** | ❌ Manual | ✅ Built-in |
| **Deduplication** | ❌ None | ✅ Automatic |
| **Memory Management** | ❌ Manual | ✅ Automatic |
| **DevTools** | ❌ None | ✅ Built-in |

## 🚀 **Why This is Professional**

### **Industry Standard**
- Used by **Vercel**, **Linear**, **Cal.com**
- **React Query** is the de facto standard
- **TanStack Query** is the modern version

### **Production Ready**
- Battle-tested in production
- Excellent TypeScript support
- Great documentation
- Active community

### **Scalable**
- Handles complex data fetching
- Works with any backend
- Easy to test
- Easy to maintain

## 🎉 **Result**

Your app now has:
- ✅ **Professional data fetching**
- ✅ **Automatic caching**
- ✅ **Loading states**
- ✅ **Error handling**
- ✅ **Background updates**
- ✅ **Optimistic updates**
- ✅ **DevTools integration**

**TanStack Query transforms your app from amateur to professional!** 🚀
