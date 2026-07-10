<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ContactSubmissionData;
use App\Http\Requests\Api\V1\Contact\SubmitContactRequest;
use App\Http\Resources\ContactSubmissionResource;
use App\Models\ContactSubmission;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends BaseApiController
{
    public function __construct(private ContactService $contactService) {}

    public function submit(SubmitContactRequest $request): JsonResponse
    {
        $submission = $this->contactService->submit(ContactSubmissionData::fromArray($request->validated()));

        return $this->created(new ContactSubmissionResource($submission), 'Pesan berhasil dikirim');
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ContactSubmission::class);
        $submissions = $this->contactService->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(ContactSubmissionResource::collection($submissions));
    }

    public function show(ContactSubmission $contactSubmission): JsonResponse
    {
        $this->authorize('view', $contactSubmission);

        return $this->success(new ContactSubmissionResource($contactSubmission));
    }

    public function markAsRead(ContactSubmission $contactSubmission): JsonResponse
    {
        $this->authorize('update', $contactSubmission);
        $submission = $this->contactService->markAsRead($contactSubmission);

        return $this->success(new ContactSubmissionResource($submission));
    }

    public function destroy(ContactSubmission $contactSubmission): JsonResponse
    {
        $this->authorize('delete', $contactSubmission);
        $this->contactService->delete($contactSubmission);

        return $this->noContent();
    }
}
