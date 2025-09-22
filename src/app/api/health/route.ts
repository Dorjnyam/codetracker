import { NextRequest, NextResponse } from 'next/server';
import { getHealthCheckData } from '@/lib/monitoring';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const healthData = await getHealthCheckData();
    
    const statusCode = healthData.status === 'healthy' ? 200 : 
                      healthData.status === 'degraded' ? 200 : 503;
    
    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        ...(config.env.nodeEnv === 'development' && { 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }),
      },
      { status: 503 }
    );
  }
}
