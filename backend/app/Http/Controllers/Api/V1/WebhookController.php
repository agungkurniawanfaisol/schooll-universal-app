<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\WebhookData;
use App\Http\Requests\Api\V1\Webhook\StoreWebhookRequest;
use App\Http\Requests\Api\V1\Webhook\UpdateWebhookRequest;
use App\Http\Resources\WebhookDeliveryResource;
use App\Http\Resources\WebhookResource;
use App\Models\Webhook;
use App\Services\WebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends BaseApiController
{
    public function __construct(private WebhookService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Webhook::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(WebhookResource::collection($items));
    }

    public function store(StoreWebhookRequest $request): JsonResponse
    {
        $this->authorize('create', Webhook::class);
        $item = $this->service->create(WebhookData::fromArray($request->validated()));

        return $this->created(new WebhookResource($item));
    }

    public function show(Webhook $webhook): JsonResponse
    {
        $this->authorize('view', $webhook);

        return $this->success(new WebhookResource($webhook));
    }

    public function update(UpdateWebhookRequest $request, Webhook $webhook): JsonResponse
    {
        $this->authorize('update', $webhook);
        $item = $this->service->update($webhook, WebhookData::fromArray($request->validated()));

        return $this->success(new WebhookResource($item), 'Updated successfully');
    }

    public function destroy(Webhook $webhook): JsonResponse
    {
        $this->authorize('delete', $webhook);
        $this->service->delete($webhook);

        return $this->noContent();
    }

    public function test(Webhook $webhook): JsonResponse
    {
        $this->authorize('update', $webhook);
        $delivery = $this->service->test($webhook);

        return $this->success(new WebhookDeliveryResource($delivery), 'Test webhook sent');
    }
}
