'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import chart components to prevent SSR hydration issues
const PieChart1 = dynamic(() => import('@/components/Charts/pchart1'), {
  ssr: false,
  loading: () => (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Aspirants</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px] pb-0 flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      </CardContent>
    </Card>
  )
});

const Pc2 = dynamic(() => import('@/components/Charts/piechart2').then(mod => ({ default: mod.Pc2 })), {
  ssr: false,
  loading: () => (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visitors</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      </CardContent>
    </Card>
  )
});

const Bchart1 = dynamic(() => import('@/components/Charts/barChart1').then(mod => ({ default: mod.Bchart1 })), {
  ssr: false,
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      </CardContent>
    </Card>
  )
});

export { PieChart1, Pc2, Bchart1 };
