<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Newsletter\SubscribeNewsletterRequest;
use App\Http\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use App\Services\NewsletterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterController extends BaseApiController
{
    public function __construct(private NewsletterService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', NewsletterSubscriber::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(NewsletterSubscriberResource::collection($items));
    }

    public function destroy(NewsletterSubscriber $newsletterSubscriber): JsonResponse
    {
        $this->authorize('delete', $newsletterSubscriber);
        $this->service->delete($newsletterSubscriber);

        return $this->noContent();
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()->can('newsletter.view'), 403);

        $filename = 'newsletter-subscribers-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function (): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['email', 'name', 'subscribed_at']);

            foreach ($this->service->exportAll() as $subscriber) {
                fputcsv($handle, [
                    $subscriber->email,
                    $subscriber->name,
                    $subscriber->subscribed_at?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function subscribe(SubscribeNewsletterRequest $request): JsonResponse
    {
        $subscriber = $this->service->subscribe($request->validated());

        return $this->created(new NewsletterSubscriberResource($subscriber), 'Berhasil berlangganan newsletter');
    }
}
