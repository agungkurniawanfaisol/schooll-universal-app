<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ApiTokenData;
use App\Http\Requests\Api\V1\ApiToken\StoreApiTokenRequest;
use App\Http\Requests\Api\V1\ApiToken\UpdateApiTokenRequest;
use App\Http\Resources\ApiTokenResource;
use App\Models\ApiToken;
use App\Services\ApiTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiTokenController extends BaseApiController
{
    public function __construct(private ApiTokenService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ApiToken::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(ApiTokenResource::collection($items));
    }

    public function store(StoreApiTokenRequest $request): JsonResponse
    {
        $this->authorize('create', ApiToken::class);
        $result = $this->service->create(ApiTokenData::fromArray($request->validated()));

        return $this->created([
            'token' => new ApiTokenResource($result['token']),
            'plain_text_token' => $result['plain_text_token'],
        ]);
    }

    public function show(ApiToken $apiToken): JsonResponse
    {
        $this->authorize('view', $apiToken);

        return $this->success(new ApiTokenResource($apiToken));
    }

    public function update(UpdateApiTokenRequest $request, ApiToken $apiToken): JsonResponse
    {
        $this->authorize('update', $apiToken);
        $item = $this->service->update($apiToken, ApiTokenData::fromArray($request->validated()));

        return $this->success(new ApiTokenResource($item), 'Updated successfully');
    }

    public function destroy(ApiToken $apiToken): JsonResponse
    {
        $this->authorize('delete', $apiToken);
        $this->service->delete($apiToken);

        return $this->noContent();
    }

    public function regenerate(ApiToken $apiToken): JsonResponse
    {
        $this->authorize('update', $apiToken);
        $result = $this->service->regenerate($apiToken);

        return $this->success([
            'token' => new ApiTokenResource($result['token']),
            'plain_text_token' => $result['plain_text_token'],
        ], 'Token regenerated successfully');
    }
}
