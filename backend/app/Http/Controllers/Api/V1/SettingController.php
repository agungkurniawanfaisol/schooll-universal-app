<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Setting\UpdateSettingRequest;
use App\Http\Resources\WebsiteSettingResource;
use App\Models\WebsiteSetting;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends BaseApiController
{
    public function __construct(private SettingService $settingService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', WebsiteSetting::class);

        return $this->success(
            WebsiteSettingResource::collection($this->settingService->all($request->get('group')))
        );
    }

    public function store(UpdateSettingRequest $request): JsonResponse
    {
        $this->authorize('create', WebsiteSetting::class);

        $setting = $this->settingService->set(
            $request->validated('key'),
            $request->validated('value'),
            $request->validated('group', 'general'),
        );

        return $this->created(new WebsiteSettingResource($setting));
    }

    public function show(WebsiteSetting $setting): JsonResponse
    {
        $this->authorize('view', $setting);

        return $this->success(new WebsiteSettingResource($setting));
    }

    public function update(UpdateSettingRequest $request, WebsiteSetting $setting): JsonResponse
    {
        $this->authorize('update', $setting);

        $setting->update($request->validated());

        return $this->success(new WebsiteSettingResource($setting->fresh()), 'Updated successfully');
    }

    public function destroy(WebsiteSetting $setting): JsonResponse
    {
        $this->authorize('delete', $setting);
        $setting->delete();

        return $this->noContent();
    }
}
