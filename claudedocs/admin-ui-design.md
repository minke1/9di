# Admin Page UI Design Specification

## Overview

This document provides a comprehensive UI design specification for an admin page that follows the existing shadcn-board project patterns. The design prioritizes consistency with current architecture while introducing enterprise-grade data management capabilities.

**Design Date**: 2025-10-13
**Project**: shadcn-board (Next.js 15 + shadcn/ui)
**Design Type**: UI-only specification (no implementation)

---

## 1. Visual Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Root Layout (app/layout.tsx)                                │
│ ┌──────────────┬────────────────────────────────────────┐  │
│ │              │ Admin Layout (app/admin/page.tsx)      │  │
│ │              │ ┌────────────────────────────────────┐ │  │
│ │              │ │ AdminHeader                        │ │  │
│ │              │ │  - Breadcrumbs                     │ │  │
│ │              │ │  - Action buttons                  │ │  │
│ │              │ └────────────────────────────────────┘ │  │
│ │ SideNavigation│ ┌────────────────────────────────────┐ │  │
│ │              │ │ AdminDashboard (Grid Layout)       │ │  │
│ │ - Search     │ │ ┌──────┐ ┌──────┐ ┌──────┐        │ │  │
│ │ - Actions    │ │ │Stat  │ │Stat  │ │Stat  │        │ │  │
│ │ - Todos List │ │ │Card 1│ │Card 2│ │Card 3│        │ │  │
│ │              │ │ └──────┘ └──────┘ └──────┘        │ │  │
│ │              │ │ ┌──────────────────────────────┐   │ │  │
│ │              │ │ │ Recent Activity Timeline     │   │ │  │
│ │              │ │ └──────────────────────────────┘   │ │  │
│ │              │ └────────────────────────────────────┘ │  │
│ │              │ ┌────────────────────────────────────┐ │  │
│ │              │ │ AdminTable                         │ │  │
│ │              │ │  - Search & Filter Bar             │ │  │
│ │              │ │  - Data Table with Actions         │ │  │
│ │              │ │  - Pagination Controls             │ │  │
│ │              │ └────────────────────────────────────┘ │  │
│ └──────────────┴────────────────────────────────────────┘  │
│ Toaster (Sonner)                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
AdminPage
├── AdminHeader
│   ├── Breadcrumb (shadcn/ui)
│   ├── Title Section
│   └── Action Button Group
├── AdminDashboard
│   ├── StatCard (×4)
│   ├── RecentActivityCard
│   └── QuickActionsCard
└── AdminTable
    ├── TableToolbar
    │   ├── SearchInput
    │   ├── FilterDropdown (shadcn/ui Select)
    │   └── ViewOptions
    ├── DataTable (shadcn/ui Table)
    │   ├── TableHeader
    │   ├── TableBody (with row actions)
    │   └── TableFooter
    └── TablePagination
```

---

## 2. File Structure Plan

```
src/
├── app/
│   └── admin/
│       ├── page.tsx                    # Main admin page component
│       └── page.module.scss            # Admin page layout styles
│
├── components/ui/common/admin/
│   ├── AdminHeader/
│   │   ├── AdminHeader.tsx
│   │   └── AdminHeader.module.scss
│   │
│   ├── AdminDashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminDashboard.module.scss
│   │   ├── StatCard.tsx
│   │   ├── StatCard.module.scss
│   │   ├── RecentActivity.tsx
│   │   └── RecentActivity.module.scss
│   │
│   ├── AdminTable/
│   │   ├── AdminTable.tsx
│   │   ├── AdminTable.module.scss
│   │   ├── TableToolbar.tsx
│   │   ├── TableToolbar.module.scss
│   │   ├── DataTableRow.tsx
│   │   ├── TablePagination.tsx
│   │   └── columns.tsx
│   │
│   └── AdminDialogs/
│       ├── TodoEditDialog.tsx
│       ├── TodoEditDialog.module.scss
│       ├── TodoDeleteDialog.tsx
│       └── BulkActionDialog.tsx
│
├── lib/admin/
│   ├── types.ts                        # TypeScript type definitions
│   ├── queries.ts                      # Supabase query functions
│   └── utils.ts                        # Admin utility functions
│
└── styles/
    └── admin-globals.scss              # Admin-specific global styles (optional)
```

---

## 3. Core Components

### 3.1 AdminPage (`app/admin/page.tsx`)

**Purpose**: Main orchestrator component for admin interface

**Component Structure**:
```typescript
"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/ui/common/admin/AdminHeader/AdminHeader"
import { AdminDashboard } from "@/components/ui/common/admin/AdminDashboard/AdminDashboard"
import { AdminTable } from "@/components/ui/common/admin/AdminTable/AdminTable"
import styles from "./page.module.scss"

export default function AdminPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  return (
    <div className={styles.adminPage}>
      <AdminHeader />
      <div className={styles.adminPage__content}>
        <AdminDashboard stats={stats} loading={loading} />
        <AdminTable data={todos} loading={loading} />
      </div>
    </div>
  )
}
```

**SCSS Structure** (`page.module.scss`):
```scss
.adminPage {
  @apply p-6 max-w-[1600px] mx-auto;

  &__content {
    @apply space-y-6;
  }
}
```

---

### 3.2 AdminHeader

**Purpose**: Page header with breadcrumbs, title, and primary actions

**Props Interface**:
```typescript
interface AdminHeaderProps {
  onRefresh?: () => void
  onExport?: () => void
  className?: string
}
```

**Component Structure**:
```typescript
"use client"

import { RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import MarkdownDialog from "@/components/ui/common/dialog/MarkdownDialog"
import styles from "./AdminHeader.module.scss"

export function AdminHeader({ onRefresh, onExport, className }: AdminHeaderProps) {
  return (
    <header className={cn(styles.adminHeader, className)}>
      <div className={styles.adminHeader__breadcrumb}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className={styles.adminHeader__title}>Admin Dashboard</h1>
      <div className={styles.adminHeader__actions}>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <MarkdownDialog />
      </div>
    </header>
  )
}
```

**SCSS Structure** (`AdminHeader.module.scss`):
```scss
.adminHeader {
  @apply flex flex-col gap-4 mb-8 pb-4 border-b;

  &__breadcrumb {
    @apply flex-1;
  }

  &__title {
    @apply text-3xl font-semibold;
  }

  &__actions {
    @apply flex items-center gap-2;
  }

  @media (min-width: 768px) {
    @apply flex-row items-center;

    &__title {
      @apply flex-1;
    }
  }
}
```

---

### 3.3 AdminDashboard

**Purpose**: Dashboard overview with statistics cards and recent activity

**Props Interface**:
```typescript
interface DashboardStats {
  totalTodos: number
  completedTodos: number
  activeTodos: number
  recentActivity: ActivityItem[]
}

interface AdminDashboardProps {
  stats: DashboardStats | null
  loading?: boolean
  className?: string
}
```

**Component Structure**:
```typescript
"use client"

import { StatCard } from "./StatCard"
import { RecentActivity } from "./RecentActivity"
import { CheckCircle2, Clock, FileText, TrendingUp } from "lucide-react"
import styles from "./AdminDashboard.module.scss"

export function AdminDashboard({ stats, loading, className }: AdminDashboardProps) {
  if (loading) return <DashboardSkeleton />

  const completionRate = stats ?
    Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0

  return (
    <div className={cn(styles.dashboard, className)}>
      <div className={styles.dashboard__statsGrid}>
        <StatCard
          title="Total Todos"
          value={stats?.totalTodos || 0}
          icon={FileText}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Active"
          value={stats?.activeTodos || 0}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Completed"
          value={stats?.completedTodos || 0}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          variant="info"
        />
      </div>
      <RecentActivity activities={stats?.recentActivity || []} />
    </div>
  )
}
```

**SCSS Structure** (`AdminDashboard.module.scss`):
```scss
.dashboard {
  @apply mb-8;

  &__statsGrid {
    @apply grid grid-cols-1 gap-4 mb-6;

    @media (min-width: 640px) {
      @apply grid-cols-2;
    }

    @media (min-width: 1024px) {
      @apply grid-cols-4;
    }
  }
}
```

---

### 3.4 StatCard

**Purpose**: Reusable statistics display card

**Props Interface**:
```typescript
interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}
```

**Component Structure**:
```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import styles from "./StatCard.module.scss"

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  variant = 'default',
  className
}: StatCardProps) {
  return (
    <Card className={cn(styles.statCard, styles[`statCard--${variant}`], className)}>
      <CardHeader className={styles.statCard__header}>
        <div className={styles.statCard__icon}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={styles.statCard__title}>{title}</span>
      </CardHeader>
      <CardContent className={styles.statCard__content}>
        <div className={styles.statCard__value}>{value}</div>
        {trend && (
          <Badge variant={trendUp ? "default" : "secondary"} className={styles.statCard__trend}>
            {trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
```

**SCSS Structure** (`StatCard.module.scss`):
```scss
.statCard {
  @apply transition-all hover:shadow-md;

  &__header {
    @apply flex flex-row items-center gap-2 pb-2;
  }

  &__icon {
    @apply p-2 rounded-md bg-muted;
  }

  &__title {
    @apply text-sm font-medium text-muted-foreground;
  }

  &__content {
    @apply pt-0;
  }

  &__value {
    @apply text-2xl font-bold;
  }

  &__trend {
    @apply mt-2 inline-flex items-center;
  }

  &--success .statCard__icon {
    @apply bg-green-100 text-green-600;
  }

  &--warning .statCard__icon {
    @apply bg-yellow-100 text-yellow-600;
  }

  &--info .statCard__icon {
    @apply bg-blue-100 text-blue-600;
  }
}
```

---

### 3.5 AdminTable

**Purpose**: Data table with CRUD operations, search, filter, and pagination

**Props Interface**:
```typescript
interface Todo {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  status?: 'active' | 'completed' | 'archived'
}

interface AdminTableProps {
  data: Todo[]
  loading?: boolean
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onBulkAction: (ids: string[], action: string) => void
  className?: string
}
```

**Component Structure**:
```typescript
"use client"

import { useState } from "react"
import { TableToolbar } from "./TableToolbar"
import { DataTableRow } from "./DataTableRow"
import { TablePagination } from "./TablePagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import styles from "./AdminTable.module.scss"

export function AdminTable({
  data,
  loading,
  onEdit,
  onDelete,
  onBulkAction,
  className
}: AdminTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const pageSize = 10
  const filteredData = data.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || todo.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className={cn(styles.adminTable, className)}>
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        selectedCount={selectedRows.length}
        onBulkAction={(action) => onBulkAction(selectedRows, action)}
      />

      <div className={styles.adminTable__container}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((todo) => (
              <DataTableRow
                key={todo.id}
                todo={todo}
                selected={selectedRows.includes(todo.id)}
                onSelect={(checked) => {/* selection logic */}}
                onEdit={() => onEdit(todo)}
                onDelete={() => onDelete(todo.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / pageSize)}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
```

**SCSS Structure** (`AdminTable.module.scss`):
```scss
.adminTable {
  @apply bg-card rounded-lg border;

  &__container {
    @apply overflow-auto max-h-[600px];

    @media (min-width: 1024px) {
      @apply max-h-[700px];
    }
  }

  &__toolbar {
    @apply p-4 border-b;
  }
}
```

---

### 3.6 TableToolbar

**Purpose**: Search, filter, and bulk action controls

**Props Interface**:
```typescript
interface TableToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
  selectedCount: number
  onBulkAction: (action: 'delete' | 'archive' | 'export') => void
}
```

**Component Structure**:
```typescript
import { Search, Filter, Archive, Trash2, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import styles from "./TableToolbar.module.scss"

export function TableToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  selectedCount,
  onBulkAction
}: TableToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar__search}>
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className={styles.toolbar__filters}>
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {selectedCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions ({selectedCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBulkAction('archive')}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkAction('delete')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkAction('export')}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
```

**SCSS Structure** (`TableToolbar.module.scss`):
```scss
.toolbar {
  @apply flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border-b bg-muted/20;

  &__search {
    @apply flex items-center gap-2 flex-1 w-full md:w-auto;
  }

  &__filters {
    @apply flex items-center gap-2 w-full md:w-auto;
  }
}
```

---

## 4. TypeScript Type Definitions

```typescript
// lib/admin/types.ts

export interface Todo {
  id: string
  title: string
  content: string
  status?: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  user_id?: string
}

export interface DashboardStats {
  totalTodos: number
  activeTodos: number
  completedTodos: number
  archivedTodos: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete' | 'archive'
  title: string
  timestamp: string
  user?: string
}

export interface TableFilters {
  search: string
  status: 'all' | 'active' | 'completed' | 'archived'
  sortBy: 'created_at' | 'updated_at' | 'title'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type BulkAction = 'delete' | 'archive' | 'export' | 'complete'
```

---

## 5. Supabase Integration Pattern

```typescript
// lib/admin/queries.ts

import { supabase } from "@/utils/supabase"
import { Todo, DashboardStats, TableFilters } from "./types"

// Fetch todos with pagination
export async function fetchTodos(
  page: number = 1,
  pageSize: number = 10,
  filters?: Partial<TableFilters>
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('todos')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(filters?.sortBy || 'created_at', {
      ascending: filters?.sortOrder === 'asc'
    })

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: data as Todo[],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

// Fetch dashboard statistics
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, status, created_at')

  if (error) throw error

  return {
    totalTodos: todos.length,
    activeTodos: todos.filter(t => t.status === 'active').length,
    completedTodos: todos.filter(t => t.status === 'completed').length,
    archivedTodos: todos.filter(t => t.status === 'archived').length,
    recentActivity: []
  }
}

// Update todo
export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from('todos')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Todo
}

// Delete todo
export async function deleteTodo(id: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Bulk operations
export async function bulkDeleteTodos(ids: string[]) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .in('id', ids)

  if (error) throw error
}
```

---

## 6. Implementation Roadmap

### Phase 1: Foundation
1. Create directory structure
2. Set up TypeScript types
3. Create Supabase query functions
4. Build AdminPage shell

### Phase 2: Dashboard
1. Implement StatCard component
2. Build AdminDashboard layout
3. Create RecentActivity component
4. Add loading skeletons

### Phase 3: Table
1. Build TableToolbar
2. Create DataTableRow
3. Implement AdminTable with pagination
4. Add bulk action handlers

### Phase 4: Dialogs & CRUD
1. Create TodoEditDialog
2. Implement delete confirmation
3. Connect CRUD to Supabase
4. Add toast notifications

### Phase 5: Polish
1. Add real-time subscriptions
2. Implement responsive design
3. Accessibility audit
4. Performance optimization

---

## 7. shadcn/ui Components Required

Install these components via `npx shadcn-ui@latest add`:

- `table` - Data table
- `card` - Dashboard cards
- `badge` - Status indicators
- `button` - Actions
- `input` - Search/forms
- `select` - Filters
- `checkbox` - Row selection
- `dropdown-menu` - Action menus
- `dialog` - Modals
- `breadcrumb` - Navigation
- `skeleton` - Loading states
- `separator` - Visual dividers
- `label` - Form labels
- `alert-dialog` - Confirmations

---

## 8. Key Design Principles

1. **Consistency**: Follow existing SCSS module + Tailwind pattern
2. **Composition**: Reuse MarkdownDialog pattern for modals
3. **Responsiveness**: Mobile-first with Tailwind breakpoints
4. **Accessibility**: ARIA labels, keyboard navigation, screen readers
5. **Performance**: Pagination, memoization, lazy loading
6. **Error Handling**: Toast notifications via Sonner
7. **Type Safety**: Comprehensive TypeScript interfaces

---

## Next Steps

1. Review this design specification
2. Install required shadcn/ui components
3. Create directory structure
4. Begin Phase 1 implementation
5. Iterate based on feedback

**Note**: This is a UI design specification only. Implementation should be done incrementally following the phased roadmap.