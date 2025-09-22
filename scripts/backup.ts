import { PrismaClient } from '@prisma/client';
import { config } from '../src/lib/config';
import { logSystemEvent } from '../src/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

class BackupManager {
  private backupDir = 'backups';
  private retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

  async createBackup(): Promise<void> {
    try {
      logSystemEvent('Backup Started', { timestamp: new Date().toISOString() });

      // Ensure backup directory exists
      await this.ensureBackupDirectory();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `backup-${timestamp}.json`);

      // Export all data
      const backupData = await this.exportAllData();

      // Write backup file
      await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));

      // Compress backup (optional)
      if (process.env.COMPRESS_BACKUPS === 'true') {
        await this.compressBackup(backupFile);
      }

      logSystemEvent('Backup Completed', {
        backupFile,
        size: (await fs.stat(backupFile)).size,
        timestamp: new Date().toISOString(),
      });

      // Clean up old backups
      await this.cleanupOldBackups();

    } catch (error) {
      logSystemEvent('Backup Failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  private async ensureBackupDirectory(): Promise<void> {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  private async exportAllData(): Promise<any> {
    const backupData = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        database: 'codetracker',
      },
      data: {
        users: await prisma.user.findMany(),
        assignments: await prisma.assignment.findMany(),
        assignmentSubmissions: await prisma.assignmentSubmission.findMany(),
        collaborationSessions: await prisma.collaborationSession.findMany(),
        collaborationParticipants: await prisma.collaborationParticipant.findMany(),
        forumPosts: await prisma.forumPost.findMany(),
        forumComments: await prisma.forumComment.findMany(),
        notifications: await prisma.notification.findMany(),
        activityLogs: await prisma.activityLog.findMany(),
        codeReviews: await prisma.codeReview.findMany(),
      },
    };

    return backupData;
  }

  private async compressBackup(backupFile: string): Promise<void> {
    // In a real implementation, you would use a compression library like 'archiver'
    // For now, we'll just log that compression would happen
    logSystemEvent('Backup Compression', { file: backupFile });
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupDir);
      const cutoffDate = new Date(Date.now() - this.retentionDays * 24 * 60 * 60 * 1000);

      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          logSystemEvent('Old Backup Removed', { file });
        }
      }
    } catch (error) {
      logSystemEvent('Backup Cleanup Failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async restoreBackup(backupFile: string): Promise<void> {
    try {
      logSystemEvent('Restore Started', { backupFile });

      // Read backup file
      const backupData = JSON.parse(await fs.readFile(backupFile, 'utf-8'));

      // Validate backup data
      if (!backupData.metadata || !backupData.data) {
        throw new Error('Invalid backup file format');
      }

      // Clear existing data (be careful in production!)
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Restore not allowed in production environment');
      }

      // Restore data in correct order (respecting foreign key constraints)
      await this.restoreData(backupData.data);

      logSystemEvent('Restore Completed', { backupFile });

    } catch (error) {
      logSystemEvent('Restore Failed', {
        backupFile,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async restoreData(data: any): Promise<void> {
    // Restore in order to respect foreign key constraints
    if (data.users) {
      await prisma.user.createMany({ data: data.users, skipDuplicates: true });
    }

    if (data.assignments) {
      await prisma.assignment.createMany({ data: data.assignments, skipDuplicates: true });
    }

    if (data.assignmentSubmissions) {
      await prisma.assignmentSubmission.createMany({ data: data.assignmentSubmissions, skipDuplicates: true });
    }

    if (data.collaborationSessions) {
      await prisma.collaborationSession.createMany({ data: data.collaborationSessions, skipDuplicates: true });
    }

    if (data.collaborationParticipants) {
      await prisma.collaborationParticipant.createMany({ data: data.collaborationParticipants, skipDuplicates: true });
    }

    if (data.forumPosts) {
      await prisma.forumPost.createMany({ data: data.forumPosts, skipDuplicates: true });
    }

    if (data.forumComments) {
      await prisma.forumComment.createMany({ data: data.forumComments, skipDuplicates: true });
    }

    if (data.notifications) {
      await prisma.notification.createMany({ data: data.notifications, skipDuplicates: true });
    }

    if (data.activityLogs) {
      await prisma.activityLog.createMany({ data: data.activityLogs, skipDuplicates: true });
    }

    if (data.codeReviews) {
      await prisma.codeReview.createMany({ data: data.codeReviews, skipDuplicates: true });
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      return files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));
    } catch {
      return [];
    }
  }

  async getBackupInfo(backupFile: string): Promise<any> {
    try {
      const filePath = path.join(this.backupDir, backupFile);
      const stats = await fs.stat(filePath);
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      return {
        file: backupFile,
        size: stats.size,
        created: stats.mtime,
        metadata: content.metadata,
        recordCounts: {
          users: content.data.users?.length || 0,
          assignments: content.data.assignments?.length || 0,
          submissions: content.data.assignmentSubmissions?.length || 0,
          sessions: content.data.collaborationSessions?.length || 0,
          posts: content.data.forumPosts?.length || 0,
          notifications: content.data.notifications?.length || 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get backup info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Main execution
async function main() {
  const backupManager = new BackupManager();

  try {
    const command = process.argv[2];
    const backupFile = process.argv[3];

    switch (command) {
      case 'create':
        await backupManager.createBackup();
        console.log('✅ Backup created successfully');
        break;

      case 'restore':
        if (!backupFile) {
          console.error('❌ Please specify backup file to restore');
          process.exit(1);
        }
        await backupManager.restoreBackup(backupFile);
        console.log('✅ Backup restored successfully');
        break;

      case 'list':
        const backups = await backupManager.listBackups();
        console.log('📋 Available backups:');
        for (const backup of backups) {
          const info = await backupManager.getBackupInfo(backup);
          console.log(`  ${backup} (${info.size} bytes, ${info.created.toISOString()})`);
        }
        break;

      case 'info':
        if (!backupFile) {
          console.error('❌ Please specify backup file');
          process.exit(1);
        }
        const info = await backupManager.getBackupInfo(backupFile);
        console.log('📊 Backup Information:');
        console.log(JSON.stringify(info, null, 2));
        break;

      default:
        console.log('Usage: npm run maintenance:backup [command] [backup-file]');
        console.log('Commands:');
        console.log('  create  - Create a new backup');
        console.log('  restore - Restore from backup file');
        console.log('  list    - List available backups');
        console.log('  info    - Show backup information');
        break;
    }
  } catch (error) {
    console.error('❌ Backup operation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { BackupManager };
