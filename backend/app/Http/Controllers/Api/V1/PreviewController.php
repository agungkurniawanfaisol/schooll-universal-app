<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\CustomPageResource;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Services\CustomPageService;
use Illuminate\Http\JsonResponse;

class PreviewController extends BaseApiController
{
    public function __construct(private CustomPageService $customPageService) {}

    public function show(string $token): JsonResponse
    {
        $customPage = $this->customPageService->findByPreviewToken($token);
        if ($customPage) {
            return $this->success([
                'type' => 'custom_page',
                'item' => new CustomPageResource($customPage),
            ]);
        }

        $news = News::query()->where('preview_token', $token)->first();
        if ($news) {
            return $this->success([
                'type' => 'news',
                'item' => new NewsResource($news),
            ]);
        }

        return $this->error('Preview not found', 404);
    }
}
