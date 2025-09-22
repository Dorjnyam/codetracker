import { PrismaClient } from '@prisma/client';
import { config } from '../src/lib/config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

// Database optimization functions
class DatabaseOptimizer {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Add database indexes for better performance
  async addIndexes(): Promise<void> {
    console.log('🔍 Adding database indexes...');

    const indexes = [
      // User table indexes
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_users_github_username ON users(githubUsername)',
      
      // Assignment table indexes
      'CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacherId)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(dueDate)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON assignments(createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_language ON assignments(language)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_difficulty ON assignments(difficulty)',
      
      // Assignment submission indexes
      'CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignmentId)',
      'CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user_id ON assignment_submissions(userId)',
      'CREATE INDEX IF NOT EXISTS idx_assignment_submissions_submitted_at ON assignment_submissions(submittedAt)',
      'CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status)',
      
      // Collaboration session indexes
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_owner_id ON collaboration_sessions(ownerId)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_status ON collaboration_sessions(status)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_type ON collaboration_sessions(type)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_visibility ON collaboration_sessions(visibility)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_created_at ON collaboration_sessions(createdAt)',
      
      // Collaboration participant indexes
      'CREATE INDEX IF NOT EXISTS idx_collaboration_participants_session_id ON collaboration_participants(sessionId)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_participants_user_id ON collaboration_participants(userId)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_participants_role ON collaboration_participants(role)',
      
      // Code review indexes
      'CREATE INDEX IF NOT EXISTS idx_code_reviews_assignment_id ON code_reviews(assignmentId)',
      'CREATE INDEX IF NOT EXISTS idx_code_reviews_reviewer_id ON code_reviews(reviewerId)',
      'CREATE INDEX IF NOT EXISTS idx_code_reviews_submission_id ON code_reviews(submissionId)',
      'CREATE INDEX IF NOT EXISTS idx_code_reviews_created_at ON code_reviews(createdAt)',
      
      // Forum indexes
      'CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON forum_posts(authorId)',
      'CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category)',
      'CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON forum_posts(isPinned)',
      
      // Forum comments indexes
      'CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(postId)',
      'CREATE INDEX IF NOT EXISTS idx_forum_comments_author_id ON forum_comments(authorId)',
      'CREATE INDEX IF NOT EXISTS idx_forum_comments_created_at ON forum_comments(createdAt)',
      
      // Notification indexes
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(userId)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(createdAt)',
      
      // Activity log indexes
      'CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(userId)',
      'CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action)',
      'CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(createdAt)',
      
      // Composite indexes for common queries
      'CREATE INDEX IF NOT EXISTS idx_assignments_teacher_status ON assignments(teacherId, status)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_user_assignment ON assignment_submissions(userId, assignmentId)',
      'CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_owner_status ON collaboration_sessions(ownerId, status)',
      'CREATE INDEX IF NOT EXISTS idx_forum_posts_category_created ON forum_posts(category, createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(userId, read)',
    ];

    for (const indexQuery of indexes) {
      try {
        await this.prisma.$executeRawUnsafe(indexQuery);
        console.log(`✅ Created index: ${indexQuery.split(' ')[5]}`);
      } catch (error) {
        console.error(`❌ Failed to create index: ${indexQuery}`, error);
      }
    }

    console.log('✅ Database indexes optimization completed');
  }

  // Analyze database performance
  async analyzePerformance(): Promise<void> {
    console.log('📊 Analyzing database performance...');

    try {
      // Get table sizes
      const tableSizes = await this.prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
      `;

      console.log('📋 Table sizes:');
      console.table(tableSizes);

      // Get index usage statistics
      const indexStats = await this.prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes 
        ORDER BY idx_scan DESC
        LIMIT 20;
      `;

      console.log('📈 Index usage statistics:');
      console.table(indexStats);

      // Get slow queries
      const slowQueries = await this.prisma.$queryRaw`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          rows
        FROM pg_stat_statements 
        WHERE mean_time > 100
        ORDER BY mean_time DESC
        LIMIT 10;
      `;

      console.log('🐌 Slow queries:');
      console.table(slowQueries);

    } catch (error) {
      console.error('❌ Performance analysis failed:', error);
    }
  }

  // Optimize database settings
  async optimizeSettings(): Promise<void> {
    console.log('⚙️ Optimizing database settings...');

    const optimizations = [
      // Connection settings
      'ALTER SYSTEM SET max_connections = 200;',
      'ALTER SYSTEM SET shared_buffers = \'256MB\';',
      'ALTER SYSTEM SET effective_cache_size = \'1GB\';',
      
      // Query planning
      'ALTER SYSTEM SET random_page_cost = 1.1;',
      'ALTER SYSTEM SET effective_io_concurrency = 200;',
      
      // Memory settings
      'ALTER SYSTEM SET work_mem = \'4MB\';',
      'ALTER SYSTEM SET maintenance_work_mem = \'64MB\';',
      
      // Logging settings
      'ALTER SYSTEM SET log_min_duration_statement = 1000;',
      'ALTER SYSTEM SET log_checkpoints = on;',
      'ALTER SYSTEM SET log_connections = on;',
      'ALTER SYSTEM SET log_disconnections = on;',
      
      // Autovacuum settings
      'ALTER SYSTEM SET autovacuum = on;',
      'ALTER SYSTEM SET autovacuum_max_workers = 3;',
      'ALTER SYSTEM SET autovacuum_naptime = \'1min\';',
    ];

    for (const optimization of optimizations) {
      try {
        await this.prisma.$executeRawUnsafe(optimization);
        console.log(`✅ Applied optimization: ${optimization.split(' ')[2]}`);
      } catch (error) {
        console.error(`❌ Failed to apply optimization: ${optimization}`, error);
      }
    }

    console.log('✅ Database settings optimization completed');
  }

  // Clean up old data
  async cleanupOldData(): Promise<void> {
    console.log('🧹 Cleaning up old data...');

    try {
      // Clean up old notifications (older than 30 days)
      const deletedNotifications = await this.prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });
      console.log(`✅ Deleted ${deletedNotifications.count} old notifications`);

      // Clean up old activity logs (older than 90 days)
      const deletedActivityLogs = await this.prisma.activityLog.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
      });
      console.log(`✅ Deleted ${deletedActivityLogs.count} old activity logs`);

      // Clean up old collaboration sessions (older than 180 days)
      const deletedSessions = await this.prisma.collaborationSession.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
          status: 'ENDED',
        },
      });
      console.log(`✅ Deleted ${deletedSessions.count} old collaboration sessions`);

      // Clean up old forum posts (older than 1 year, not pinned)
      const deletedForumPosts = await this.prisma.forumPost.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
          isPinned: false,
        },
      });
      console.log(`✅ Deleted ${deletedForumPosts.count} old forum posts`);

    } catch (error) {
      console.error('❌ Data cleanup failed:', error);
    }

    console.log('✅ Data cleanup completed');
  }

  // Vacuum and analyze tables
  async vacuumAndAnalyze(): Promise<void> {
    console.log('🔧 Running VACUUM and ANALYZE...');

    try {
      // Get all tables
      const tables = await this.prisma.$queryRaw`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public';
      `;

      for (const table of tables as any[]) {
        const tableName = table.tablename;
        
        try {
          // VACUUM table
          await this.prisma.$executeRawUnsafe(`VACUUM ANALYZE ${tableName};`);
          console.log(`✅ VACUUM ANALYZE completed for ${tableName}`);
        } catch (error) {
          console.error(`❌ VACUUM ANALYZE failed for ${tableName}:`, error);
        }
      }

    } catch (error) {
      console.error('❌ VACUUM and ANALYZE failed:', error);
    }

    console.log('✅ VACUUM and ANALYZE completed');
  }

  // Update table statistics
  async updateStatistics(): Promise<void> {
    console.log('📊 Updating table statistics...');

    try {
      await this.prisma.$executeRawUnsafe('ANALYZE;');
      console.log('✅ Table statistics updated');
    } catch (error) {
      console.error('❌ Statistics update failed:', error);
    }
  }

  // Check database health
  async checkHealth(): Promise<void> {
    console.log('🏥 Checking database health...');

    try {
      // Check connection
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection is healthy');

      // Check for deadlocks
      const deadlocks = await this.prisma.$queryRaw`
        SELECT count(*) as deadlock_count 
        FROM pg_stat_database 
        WHERE deadlocks > 0;
      `;
      console.log(`📊 Deadlock count: ${(deadlocks as any)[0].deadlock_count}`);

      // Check for long-running queries
      const longQueries = await this.prisma.$queryRaw`
        SELECT 
          pid,
          now() - pg_stat_activity.query_start AS duration,
          query 
        FROM pg_stat_activity 
        WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
      `;
      
      if ((longQueries as any[]).length > 0) {
        console.log('⚠️ Long-running queries detected:');
        console.table(longQueries);
      } else {
        console.log('✅ No long-running queries detected');
      }

      // Check database size
      const dbSize = await this.prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size;
      `;
      console.log(`📊 Database size: ${(dbSize as any)[0].size}`);

    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  // Run full optimization
  async runFullOptimization(): Promise<void> {
    console.log('🚀 Starting full database optimization...');

    try {
      await this.checkHealth();
      await this.addIndexes();
      await this.optimizeSettings();
      await this.cleanupOldData();
      await this.vacuumAndAnalyze();
      await this.updateStatistics();
      await this.analyzePerformance();

      console.log('✅ Full database optimization completed successfully!');
    } catch (error) {
      console.error('❌ Full optimization failed:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const optimizer = new DatabaseOptimizer(prisma);

  try {
    const command = process.argv[2];

    switch (command) {
      case 'indexes':
        await optimizer.addIndexes();
        break;
      case 'analyze':
        await optimizer.analyzePerformance();
        break;
      case 'optimize':
        await optimizer.optimizeSettings();
        break;
      case 'cleanup':
        await optimizer.cleanupOldData();
        break;
      case 'vacuum':
        await optimizer.vacuumAndAnalyze();
        break;
      case 'health':
        await optimizer.checkHealth();
        break;
      case 'full':
        await optimizer.runFullOptimization();
        break;
      default:
        console.log('Usage: npm run db:optimize [command]');
        console.log('Commands:');
        console.log('  indexes  - Add database indexes');
        console.log('  analyze  - Analyze performance');
        console.log('  optimize - Optimize settings');
        console.log('  cleanup  - Clean up old data');
        console.log('  vacuum   - Run VACUUM and ANALYZE');
        console.log('  health   - Check database health');
        console.log('  full     - Run full optimization');
        break;
    }
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { DatabaseOptimizer };
