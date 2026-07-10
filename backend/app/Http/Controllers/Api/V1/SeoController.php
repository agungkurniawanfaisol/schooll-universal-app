<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Seo\UpdateSeoRequest;
use App\Http\Resources\SeoSettingResource;
use App\Models\SeoSetting;
use App\Services\SeoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoController extends BaseApiController
{
    public function __construct(private SeoService $seoService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', SeoSetting::class);

        return $this->success(SeoSettingResource::collection($this->seoService->all()));
    }

    public function store(UpdateSeoRequest $request): JsonResponse
    {
        $this->authorize('create', SeoSetting::class);

        $seo = $this->seoService->upsert(
            $request->validated('page_key'),
            $request->validated(),
        );

        return $this->created(new SeoSettingResource($seo));
    }

    public function show(string $pageKey): JsonResponse
    {
        $seo = $this->seoService->getByPageKey($pageKey);

        if (! $seo) {
            return $this->error('SEO setting not found', 404);
        }

        $this->authorize('view', $seo);

        return $this->success(new SeoSettingResource($seo));
    }

    public function update(UpdateSeoRequest $request, string $pageKey): JsonResponse
    {
        abort_unless($request->user()->can('seo.update'), 403);

        $seo = $this->seoService->upsert($pageKey, $request->validated());

        return $this->success(new SeoSettingResource($seo), 'Updated successfully');
    }

    public function destroy(SeoSetting $seoSetting): JsonResponse
    {
        $this->authorize('delete', $seoSetting);
        $seoSetting->delete();

        return $this->noContent();
    }
}
