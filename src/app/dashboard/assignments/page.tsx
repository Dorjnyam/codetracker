'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Assignment, 
  AssignmentListResponse, 
  AssignmentFilter, 
  AssignmentSort 
} from '@/types/assignment';

export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<AssignmentFilter>({});
  const [currentSort, setCurrentSort] = useState<AssignmentSort>({
    field: 'dueDate',
    direction: 'asc',
  });

  const fetchAssignments = async (pageNum: number, filter: AssignmentFilter, sort: AssignmentSort) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        sortField: sort.field,
        sortDirection: sort.direction,
      });

      if (filter.search) params.append('search', filter.search);
      if (filter.language?.length) params.append('language', filter.language.join(','));
      if (filter.difficulty?.length) params.append('difficulty', filter.difficulty.join(','));
      if (filter.status?.length) params.append('status', filter.status.join(','));
      if (filter.classId) params.append('classId', filter.classId);

      const response = await fetch(`/api/assignments?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data: AssignmentListResponse = await response.json();
      setAssignments(data.assignments);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) return;

    fetchAssignments(page, currentFilter, currentSort);
  }, [session, status, page, currentFilter, currentSort]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchAssignments(newPage, currentFilter, currentSort);
  };

  const handleFilterChange = (filter: AssignmentFilter) => {
    setCurrentFilter(filter);
    setPage(1);
    fetchAssignments(1, filter, currentSort);
  };

  const handleSortChange = (sort: AssignmentSort) => {
    setCurrentSort(sort);
    setPage(1);
    fetchAssignments(1, currentFilter, sort);
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            {session.user.role === 'STUDENT' 
              ? 'View and complete your coding assignments'
              : 'Manage assignments for your classes'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">
                {session.user.role === 'STUDENT' ? 'Available to you' : 'Created by you'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.filter(a => 
                  a.submissions && a.submissions.length > 0 && 
                  a.submissions[0].status === 'GRADED'
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {session.user.role === 'STUDENT' ? 'By you' : 'By students'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.filter(a => 
                  !a.submissions || a.submissions.length === 0 ||
                  a.submissions[0].status === 'PENDING'
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {session.user.role === 'STUDENT' ? 'To complete' : 'To grade'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.filter(a => new Date(a.dueDate) < new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Past due date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assignment List */}
        <AssignmentList
          assignments={assignments}
          total={total}
          page={page}
          limit={limit}
          hasMore={hasMore}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          userRole={session.user.role}
        />
      </div>
    </DashboardLayout>
  );
}
