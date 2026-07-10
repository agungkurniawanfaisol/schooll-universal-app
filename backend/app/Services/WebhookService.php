<?php

namespace App\Services;

use App\DTOs\WebhookData;
use App\Models\Webhook;
use App\Models\WebhookDelivery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WebhookService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Webhook::query()->orderByDesc('created_at');

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?Webhook
    {
        return Webhook::query()->find($id);
    }

    public function create(WebhookData $data): Webhook
    {
        $attrs = $data->toArray();
        $attrs['secret'] = $attrs['secret'] ?? Str::random(32);

        return Webhook::query()->create($attrs);
    }

    public function update(Webhook $webhook, WebhookData $data): Webhook
    {
        $webhook->update($data->toArray());

        return $webhook->fresh();
    }

    public function delete(Webhook $webhook): bool
    {
        return (bool) $webhook->delete();
    }

    public function test(Webhook $webhook): WebhookDelivery
    {
        $payload = [
            'event' => 'webhook.test',
            'timestamp' => now()->toIso8601String(),
            'data' => ['message' => 'Test webhook delivery'],
        ];

        return $this->deliver($webhook, 'webhook.test', $payload);
    }

    public function deliver(Webhook $webhook, string $event, array $payload): WebhookDelivery
    {
        $delivery = WebhookDelivery::query()->create([
            'webhook_id' => $webhook->id,
            'event' => $event,
            'payload' => $payload,
        ]);

        try {
            $response = Http::timeout(10)
                ->withHeaders($this->buildHeaders($webhook, $payload))
                ->post($webhook->url, $payload);

            $delivery->update([
                'response_status' => $response->status(),
                'response_body' => substr($response->body(), 0, 5000),
                'delivered_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $delivery->update([
                'response_status' => 0,
                'response_body' => $e->getMessage(),
                'delivered_at' => now(),
            ]);
        }

        return $delivery->fresh();
    }

    /** @return array<string, string> */
    private function buildHeaders(Webhook $webhook, array $payload): array
    {
        $body = json_encode($payload) ?: '';
        $signature = hash_hmac('sha256', $body, $webhook->secret ?? '');

        return [
            'Content-Type' => 'application/json',
            'X-Webhook-Signature' => $signature,
        ];
    }
}
