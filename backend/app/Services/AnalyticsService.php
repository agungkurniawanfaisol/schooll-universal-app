<?php

namespace App\Services;

use App\Models\PageView;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function dashboardStats(?int $days = 30): array
    {
        $since = now()->subDays($days);

        $totalViews = PageView::query()->where('viewed_at', '>=', $since)->count();

        $viewsByDay = PageView::query()
            ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('COUNT(*) as views'))
            ->where('viewed_at', '>=', $since)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topPaths = PageView::query()
            ->select('path', DB::raw('COUNT(*) as views'))
            ->where('viewed_at', '>=', $since)
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        $todayViews = PageView::query()
            ->whereDate('viewed_at', Carbon::today())
            ->count();

        return [
            'total_views' => $totalViews,
            'today_views' => $todayViews,
            'views_by_day' => $viewsByDay,
            'top_paths' => $topPaths,
            'period_days' => $days,
        ];
    }

    public function recordView(string $path, ?int $tenantId = null): PageView
    {
        return PageView::query()->create([
            'tenant_id' => $tenantId,
            'path' => $path,
            'ip_address' => request()->ip(),
            'user_agent' => substr((string) request()->userAgent(), 0, 500),
            'referer' => substr((string) request()->header('referer'), 0, 500) ?: null,
            'viewed_at' => now(),
        ]);
    }
}
