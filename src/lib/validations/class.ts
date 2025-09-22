import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100, 'Class name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  semester: z.string().max(50, 'Semester must be less than 50 characters').optional(),
});

export const joinClassSchema = z.object({
  inviteCode: z.string().min(1, 'Invite code is required'),
});

export const updateClassSchema = createClassSchema.partial().extend({
  id: z.string().min(1, 'Class ID is required'),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type JoinClassInput = z.infer<typeof joinClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
