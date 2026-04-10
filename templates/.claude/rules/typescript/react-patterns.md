# TypeScript React Patterns

## Component Patterns

### Compound Components
```typescript
const Tabs = ({ children }: { readonly children: React.ReactNode }) => { ... };
const TabList = ({ children }: { readonly children: React.ReactNode }) => { ... };
const Tab = ({ children }: { readonly children: React.ReactNode }) => { ... };
const TabPanel = ({ children }: { readonly children: React.ReactNode }) => { ... };

// Usage
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>
```

### Render Props
```typescript
interface DataFetcherProps<T> {
  readonly url: string;
  readonly render: (data: T, isLoading: boolean) => React.ReactNode;
}
```

### Generic Components
```typescript
interface ListProps<T> {
  readonly items: readonly T[];
  readonly renderItem: (item: T) => React.ReactNode;
  readonly keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## Hook Patterns

### Data Fetching Hook
```typescript
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, error, isLoading } as const;
}
```

## State Patterns

- **Server state**: TanStack Query (fetching, caching, invalidation)
- **Client state**: Zustand (global) or useState (local)
- **Form state**: React Hook Form + Zod validation
- **URL state**: React Router params (standalone) or Next.js searchParams
