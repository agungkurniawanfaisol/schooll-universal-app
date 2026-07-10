<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends BaseApiController
{
    public function __construct(private AnalyticsService $service) {}

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('analytics.view'), 403);

        $days = (int) $request->get('days', 30);

        return $this->success($this->service->dashboardStats($days));
    }
}
