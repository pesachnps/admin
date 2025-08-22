import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserCardSkeleton() {
  return (
    <Card className="bg-card/30 border-border/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full bg-secondary" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-secondary" />
              <Skeleton className="h-4 w-16 bg-secondary" />
            </div>
          </div>
          <Skeleton className="w-6 h-6 rounded bg-secondary" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded bg-secondary" />
            <Skeleton className="h-4 w-48 bg-secondary" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded bg-secondary" />
            <Skeleton className="h-4 w-36 bg-secondary" />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border/50">
          <Skeleton className="h-8 w-16 bg-secondary ml-auto" />
        </div>
      </CardContent>
    </Card>
  );
}