'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, X, User, Building, Github } from 'lucide-react';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/auth';
import { useSession } from 'next-auth/react';

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    username?: string | null;
    bio?: string | null;
    githubUsername?: string | null;
    preferredLanguages?: string;
    institution?: string | null;
    image?: string | null;
  };
  onUpdate?: () => void;
}

const PROGRAMMING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
  'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala',
  'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'React', 'Vue', 'Angular'
];

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    user.preferredLanguages ? user.preferredLanguages.split(',') : []
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null);
  const { update: updateSession } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      githubUsername: user.githubUsername || '',
      institution: user.institution || '',
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          preferredLanguages: selectedLanguages,
          image: avatarPreview,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      
      // Update session
      await updateSession({
        ...data,
        image: avatarPreview,
      });

      onUpdate?.();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setAvatarPreview(result.url);
      setSuccess('Avatar updated successfully!');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarPreview || ''} alt={user.name || 'User'} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAvatarPreview(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user.username || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="institution">Institution/School</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="institution"
                  {...register('institution')}
                  placeholder="Your school or organization"
                  className="pl-10"
                />
              </div>
              {errors.institution && (
                <p className="text-sm text-red-500">{errors.institution.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUsername">GitHub Username</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="githubUsername"
                  {...register('githubUsername')}
                  placeholder="your-github-username"
                  className="pl-10"
                />
              </div>
              {errors.githubUsername && (
                <p className="text-sm text-red-500">{errors.githubUsername.message}</p>
              )}
            </div>
          </div>

          {/* Programming Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Programming Languages</h3>
            <p className="text-sm text-muted-foreground">
              Select the programming languages you&apos;re interested in or currently learning
            </p>
            
            <div className="flex flex-wrap gap-2">
              {PROGRAMMING_LANGUAGES.map((language) => (
                <Badge
                  key={language}
                  variant={selectedLanguages.includes(language) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleLanguageToggle(language)}
                >
                  {language}
                </Badge>
              ))}
            </div>
            
            {selectedLanguages.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Languages ({selectedLanguages.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((language) => (
                    <Badge key={language} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
