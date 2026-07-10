<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Activity;
use App\Models\Agenda;
use App\Models\ContactSubmission;
use App\Models\News;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->can('dashboard.view'), 403);

        return $this->success([
            'stats' => [
                'users' => User::query()->count(),
                'teachers' => Teacher::query()->count(),
                'activities' => Activity::query()->count(),
                'agendas' => Agenda::query()->count(),
                'news' => News::query()->count(),
                'unread_contacts' => ContactSubmission::query()->where('is_read', false)->count(),
            ],
            'recent_news' => News::query()->latest()->limit(5)->get(['id', 'title', 'status', 'published_at', 'created_at']),
            'upcoming_agendas' => Agenda::query()->where('date', '>=', now()->toDateString())->orderBy('date')->limit(5)->get(['id', 'title', 'date', 'location']),
        ]);
    }
}
