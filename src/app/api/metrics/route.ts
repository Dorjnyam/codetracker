import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceMetrics } from '@/lib/monitoring';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Check if metrics endpoint is enabled
    if (!config.monitoring.performance.enabled) {
      return NextResponse.json(
        { error: 'Performance monitoring is disabled' },
        { status: 403 }
      );
    }

    const metrics = getPerformanceMetrics();
    
    return NextResponse.json(metrics, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve metrics',
        ...(config.env.nodeEnv === 'development' && { 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }),
      },
      { status: 500 }
    );
  }
}
