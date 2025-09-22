'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Code, 
  Clock, 
  Target,
  FileText,
  Upload,
  Calendar
} from 'lucide-react';
import { 
  CreateAssignmentForm, 
  ProgrammingLanguage, 
  DifficultyLevel,
  StarterCode,
  TestCase,
  AssignmentResource,
  TestCaseType
} from '@/types/assignment';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  instructions: z.string().min(1, 'Instructions are required'),
  language: z.enum(['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  dueDate: z.string().min(1, 'Due date is required'),
  timeLimit: z.number().min(1).max(300).optional(),
  maxAttempts: z.number().min(1).max(10).optional(),
  points: z.number().min(1).max(1000),
  classId: z.string().min(1, 'Class is required'),
  starterCode: z.array(z.object({
    language: z.string(),
    code: z.string(),
    fileName: z.string(),
  })),
  testCases: z.array(z.object({
    name: z.string().min(1, 'Test case name is required'),
    description: z.string().optional(),
    type: z.enum(['INPUT_OUTPUT', 'FUNCTIONAL', 'PERFORMANCE', 'SECURITY']),
    input: z.string(),
    expectedOutput: z.string(),
    timeout: z.number().min(100).max(30000),
    points: z.number().min(0),
    isHidden: z.boolean(),
    order: z.number(),
  })),
  resources: z.array(z.object({
    name: z.string().min(1, 'Resource name is required'),
    type: z.enum(['FILE', 'URL', 'TEXT']),
    url: z.string().optional(),
    content: z.string().optional(),
    fileName: z.string().optional(),
  })),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  initialData?: Partial<CreateAssignmentForm>;
  onSubmit: (data: CreateAssignmentForm) => Promise<void>;
  isEditing?: boolean;
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

const testCaseTypes: { value: TestCaseType; label: string }[] = [
  { value: 'INPUT_OUTPUT', label: 'Input/Output' },
  { value: 'FUNCTIONAL', label: 'Functional' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'SECURITY', label: 'Security' },
];

export function AssignmentForm({ initialData, onSubmit, isEditing = false }: AssignmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      instructions: initialData?.instructions || '',
      language: initialData?.language || 'python',
      difficulty: initialData?.difficulty || 'EASY',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : '',
      timeLimit: initialData?.timeLimit || undefined,
      maxAttempts: initialData?.maxAttempts || undefined,
      points: initialData?.points || 100,
      classId: initialData?.classId || '',
      starterCode: initialData?.starterCode || [],
      testCases: initialData?.testCases || [],
      resources: initialData?.resources || [],
    },
  });

  const {
    fields: starterCodeFields,
    append: appendStarterCode,
    remove: removeStarterCode,
  } = useFieldArray({
    control,
    name: 'starterCode',
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    control,
    name: 'testCases',
  });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: 'resources',
  });

  const watchedLanguage = watch('language');
  const watchedDifficulty = watch('difficulty');

  const onFormSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const formData: CreateAssignmentForm = {
        ...data,
        dueDate: new Date(data.dueDate),
        starterCode: data.starterCode.map((code, index) => ({
          ...code,
          language: code.language as ProgrammingLanguage,
        })),
        testCases: data.testCases.map((testCase, index) => ({
          ...testCase,
          id: `test_${Date.now()}_${index}`,
          type: testCase.type as TestCaseType,
        })),
        resources: data.resources.map((resource, index) => ({
          ...resource,
          id: `resource_${Date.now()}_${index}`,
        })),
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStarterCode = () => {
    appendStarterCode({
      language: watchedLanguage,
      code: '',
      fileName: `main.${watchedLanguage === 'javascript' ? 'js' : watchedLanguage === 'typescript' ? 'ts' : watchedLanguage}`,
    });
  };

  const addTestCase = () => {
    appendTestCase({
      name: '',
      description: '',
      type: 'INPUT_OUTPUT',
      input: '',
      expectedOutput: '',
      timeout: 5000,
      points: 10,
      isHidden: false,
      order: testCaseFields.length,
    });
  };

  const addResource = () => {
    appendResource({
      name: '',
      type: 'TEXT',
      content: '',
    });
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assignment Preview</h2>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <Eye className="mr-2 h-4 w-4" />
            Edit Mode
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{watch('title') || 'Untitled Assignment'}</CardTitle>
                <CardDescription>{watch('description') || 'No description'}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={difficultyLevels.find(d => d.value === watchedDifficulty)?.color}>
                  {difficultyLevels.find(d => d.value === watchedDifficulty)?.label}
                </Badge>
                <Badge variant="outline">
                  {programmingLanguages.find(l => l.value === watchedLanguage)?.label}
                </Badge>
                <Badge variant="secondary">{watch('points')} points</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3>Instructions</h3>
              <p className="whitespace-pre-wrap">{watch('instructions')}</p>
              
              {watch('starterCode')?.length > 0 && (
                <>
                  <h3>Starter Code</h3>
                  {watch('starterCode').map((code, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <h4>{code.fileName}</h4>
                      <pre className="text-sm"><code>{code.code}</code></pre>
                    </div>
                  ))}
                </>
              )}

              {watch('testCases')?.length > 0 && (
                <>
                  <h3>Test Cases</h3>
                  <p>{watch('testCases').length} test case(s) configured</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Provide the essential details for your assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter assignment title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the assignment"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              {...register('instructions')}
              placeholder="Detailed instructions for students"
              rows={6}
            />
            {errors.instructions && (
              <p className="text-sm text-red-600">{errors.instructions.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language">Programming Language *</Label>
              <Select value={watchedLanguage} onValueChange={(value) => setValue('language', value as ProgrammingLanguage)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-sm text-red-600">{errors.language.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select value={watchedDifficulty} onValueChange={(value) => setValue('difficulty', value as DifficultyLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="points">Points *</Label>
              <Input
                id="points"
                type="number"
                {...register('points', { valueAsNumber: true })}
                min="1"
                max="1000"
              />
              {errors.points && (
                <p className="text-sm text-red-600">{errors.points.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                {...register('dueDate')}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                {...register('timeLimit', { valueAsNumber: true })}
                min="1"
                max="300"
                placeholder="Optional"
              />
            </div>

            <div>
              <Label htmlFor="maxAttempts">Max Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                {...register('maxAttempts', { valueAsNumber: true })}
                min="1"
                max="10"
                placeholder="Unlimited"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Starter Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Starter Code
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addStarterCode}>
              <Plus className="mr-2 h-4 w-4" />
              Add Code
            </Button>
          </CardTitle>
          <CardDescription>
            Provide starter code templates for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {starterCodeFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Code Template {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStarterCode(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>File Name</Label>
                  <Input
                    {...register(`starterCode.${index}.fileName`)}
                    placeholder="main.py"
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Select
                    value={watch(`starterCode.${index}.language`)}
                    onValueChange={(value) => setValue(`starterCode.${index}.language`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2">
                <Label>Code</Label>
                <Textarea
                  {...register(`starterCode.${index}.code`)}
                  placeholder="Enter starter code here..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          ))}
          {starterCodeFields.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No starter code added yet. Click "Add Code" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Test Cases
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
              <Plus className="mr-2 h-4 w-4" />
              Add Test Case
            </Button>
          </CardTitle>
          <CardDescription>
            Define test cases for automated grading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCaseFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Test Case {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestCase(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Test Case Name *</Label>
                  <Input
                    {...register(`testCases.${index}.name`)}
                    placeholder="Test case name"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={watch(`testCases.${index}.type`)}
                    onValueChange={(value) => setValue(`testCases.${index}.type`, value as TestCaseType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {testCaseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label>Description</Label>
                <Textarea
                  {...register(`testCases.${index}.description`)}
                  placeholder="Describe what this test case validates"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Input</Label>
                  <Textarea
                    {...register(`testCases.${index}.input`)}
                    placeholder="Test input"
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Expected Output</Label>
                  <Textarea
                    {...register(`testCases.${index}.expectedOutput`)}
                    placeholder="Expected output"
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label>Timeout (ms)</Label>
                  <Input
                    type="number"
                    {...register(`testCases.${index}.timeout`, { valueAsNumber: true })}
                    min="100"
                    max="30000"
                    defaultValue={5000}
                  />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    {...register(`testCases.${index}.points`, { valueAsNumber: true })}
                    min="0"
                    defaultValue={10}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`testCases.${index}.isHidden`)}
                    className="rounded"
                  />
                  <Label>Hidden test case</Label>
                </div>
              </div>
            </div>
          ))}
          {testCaseFields.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No test cases added yet. Click "Add Test Case" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Resources
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addResource}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </CardTitle>
          <CardDescription>
            Add additional resources for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resourceFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Resource {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResource(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Resource Name *</Label>
                  <Input
                    {...register(`resources.${index}.name`)}
                    placeholder="Resource name"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={watch(`resources.${index}.type`)}
                    onValueChange={(value) => setValue(`resources.${index}.type`, value as 'FILE' | 'URL' | 'TEXT')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="URL">URL</SelectItem>
                      <SelectItem value="FILE">File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {watch(`resources.${index}.type`) === 'TEXT' && (
                <div className="mt-4">
                  <Label>Content</Label>
                  <Textarea
                    {...register(`resources.${index}.content`)}
                    placeholder="Resource content"
                    rows={4}
                  />
                </div>
              )}

              {watch(`resources.${index}.type`) === 'URL' && (
                <div className="mt-4">
                  <Label>URL</Label>
                  <Input
                    {...register(`resources.${index}.url`)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              )}
            </div>
          ))}
          {resourceFields.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No resources added yet. Click "Add Resource" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreviewMode(true)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Assignment' : 'Create Assignment'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
