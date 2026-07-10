<?php

namespace App\Services;

use App\Models\Webhook;

class WebhookDispatcher
{
    public function __construct(private WebhookService $webhookService) {}

    public function dispatch(string $event, array $payload): void
    {
        $webhooks = Webhook::query()
            ->where('is_active', true)
            ->get()
            ->filter(fn (Webhook $webhook) => in_array($event, $webhook->events ?? [], true));

        foreach ($webhooks as $webhook) {
            $this->webhookService->deliver($webhook, $event, [
                'event' => $event,
                'timestamp' => now()->toIso8601String(),
                'data' => $payload,
            ]);
        }
    }
}
