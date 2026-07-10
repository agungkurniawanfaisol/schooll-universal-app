<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends BaseApiController
{
    public function __construct(private ActivityLogService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ActivityLog::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(ActivityLogResource::collection($items));
    }
}
