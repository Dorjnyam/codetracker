'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  Target, 
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Assignment, 
  AssignmentFilter, 
  AssignmentSort,
  ProgrammingLanguage,
  DifficultyLevel,
  AssignmentStatus
} from '@/types/assignment';

interface AssignmentListProps {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: AssignmentFilter) => void;
  onSortChange: (sort: AssignmentSort) => void;
  userRole: string;
}

const programmingLanguages: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'r', label: 'R' },
  { value: 'matlab', label: 'MATLAB' },
];

const difficultyLevels: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'EASY', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HARD', label: 'Hard', color: 'bg-orange-100 text-orange-800' },
  { value: 'EXPERT', label: 'Expert', color: 'bg-red-100 text-red-800' },
];

const statusOptions: { value: AssignmentStatus; label: string; color: string }[] = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-blue-100 text-blue-800' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-red-100 text-red-800' },
];

export function AssignmentList({
  assignments,
  total,
  page,
  limit,
  hasMore,
  onPageChange,
  onFilterChange,
  onSortChange,
  userRole,
}: AssignmentListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      search: value || undefined,
      language: selectedLanguage ? [selectedLanguage as ProgrammingLanguage] : undefined,
      difficulty: selectedDifficulty ? [selectedDifficulty as DifficultyLevel] : undefined,
      status: selectedStatus ? [selectedStatus as AssignmentStatus] : undefined,
    });
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onFilterChange({
      search: searchTerm || undefined,
      language: value ? [value as ProgrammingLanguage] : undefined,
      difficulty: selectedDifficulty ? [selectedDifficulty as DifficultyLevel] : undefined,
      status: selectedStatus ? [selectedStatus as AssignmentStatus] : undefined,
    });
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
    onFilterChange({
      search: searchTerm || undefined,
      language: selectedLanguage ? [selectedLanguage as ProgrammingLanguage] : undefined,
      difficulty: value ? [value as DifficultyLevel] : undefined,
      status: selectedStatus ? [selectedStatus as AssignmentStatus] : undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilterChange({
      search: searchTerm || undefined,
      language: selectedLanguage ? [selectedLanguage as ProgrammingLanguage] : undefined,
      difficulty: selectedDifficulty ? [selectedDifficulty as DifficultyLevel] : undefined,
      status: value ? [value as AssignmentStatus] : undefined,
    });
  };

  const handleSortChange = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSortChange({ field: field as any, direction: newDirection });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubmissionStatus = (assignment: Assignment) => {
    if (!assignment.submissions || assignment.submissions.length === 0) {
      return { status: 'Not Started', color: 'bg-gray-100 text-gray-800' };
    }

    const latestSubmission = assignment.submissions[0];
    switch (latestSubmission.status) {
      case 'SUBMITTED':
        return { status: 'Submitted', color: 'bg-blue-100 text-blue-800' };
      case 'GRADED':
        return { status: 'Graded', color: 'bg-green-100 text-green-800' };
      case 'LATE':
        return { status: 'Late', color: 'bg-red-100 text-red-800' };
      default:
        return { status: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const isOverdue = (dueDate: Date | string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-muted-foreground">
            {total} assignment{total !== 1 ? 's' : ''} found
          </p>
        </div>
        {userRole === 'TEACHER' && (
          <Button onClick={() => router.push('/dashboard/assignments/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {userRole === 'TEACHER' && (
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('dueDate')}
                className={sortField === 'dueDate' ? 'bg-accent' : ''}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Due Date
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('points')}
                className={sortField === 'points' ? 'bg-accent' : ''}
              >
                <Target className="mr-2 h-4 w-4" />
                Points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => {
          const submissionStatus = getSubmissionStatus(assignment);
          const overdue = isOverdue(assignment.dueDate);

          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {assignment.description}
                    </CardDescription>
                  </div>
                  {userRole === 'TEACHER' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/assignments/${assignment.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/assignments/${assignment.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/assignments/${assignment.id}/submissions`)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Submissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={difficultyLevels.find(d => d.value === assignment.difficulty)?.color}>
                    {difficultyLevels.find(d => d.value === assignment.difficulty)?.label}
                  </Badge>
                  <Badge variant="outline">
                    {programmingLanguages.find(l => l.value === assignment.language)?.label}
                  </Badge>
                  <Badge variant="secondary">{assignment.points} pts</Badge>
                  {userRole === 'TEACHER' && (
                    <Badge className={statusOptions.find(s => s.value === assignment.status)?.color}>
                      {statusOptions.find(s => s.value === assignment.status)?.label}
                    </Badge>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className={overdue ? 'text-red-600 font-medium' : ''}>
                    Due: {formatDate(assignment.dueDate)}
                  </span>
                  {overdue && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
                </div>

                {/* Time Limit */}
                {assignment.timeLimit && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{assignment.timeLimit} minutes</span>
                  </div>
                )}

                {/* Submission Status (for students) */}
                {userRole === 'STUDENT' && (
                  <div className="flex items-center justify-between">
                    <Badge className={submissionStatus.color}>
                      {submissionStatus.status}
                    </Badge>
                    {assignment.submissions && assignment.submissions.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {assignment.submissions[0].attempts} attempt{assignment.submissions[0].attempts !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}

                {/* Submission Count (for teachers) */}
                {userRole === 'TEACHER' && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {assignment._count?.submissions || 0} submission{(assignment._count?.submissions || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/assignments/${assignment.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  {userRole === 'STUDENT' && assignment.status === 'PUBLISHED' && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/assignments/${assignment.id}/submit`)}
                    >
                      Start Assignment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {assignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedLanguage || selectedDifficulty || selectedStatus
                ? 'Try adjusting your filters to see more results.'
                : 'There are no assignments available at the moment.'}
            </p>
            {userRole === 'TEACHER' && (
              <Button onClick={() => router.push('/dashboard/assignments/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} assignments
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasMore}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
