import { z } from 'zod';

export const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  expectedOutput: z.string().min(1, 'Expected output is required'),
  isHidden: z.boolean().default(false),
  description: z.string().optional(),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  classId: z.string().min(1, 'Class is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
  language: z.string().min(1, 'Language is required'),
  maxScore: z.number().min(1, 'Max score must be at least 1').max(1000, 'Max score must be less than 1000'),
  dueDate: z.date().optional(),
  testCases: z.array(testCaseSchema).min(1, 'At least one test case is required'),
  starterCode: z.string().optional(),
  instructions: z.string().min(1, 'Instructions are required').max(2000, 'Instructions must be less than 2000 characters'),
  allowLateSubmission: z.boolean().default(false),
  maxAttempts: z.number().min(1).max(10).optional(),
  timeLimit: z.number().min(1).max(300).optional(), // max 5 hours
});

export const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  id: z.string().min(1, 'Assignment ID is required'),
});

export const submitCodeSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
export type TestCaseInput = z.infer<typeof testCaseSchema>;
