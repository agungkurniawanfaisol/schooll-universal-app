<?php

namespace App\Services;

use App\DTOs\ContactSubmissionData;
use App\Models\ContactSubmission;

class ContactService
{
    public function __construct(private WebhookDispatcher $webhookDispatcher) {}

    public function submit(ContactSubmissionData $data): ContactSubmission
    {
        $submission = ContactSubmission::query()->create($data->toArray());
        $this->webhookDispatcher->dispatch('contact.submitted', $submission->toArray());

        return $submission;
    }

    public function list(array $filters = [], int $perPage = 15)
    {
        $query = ContactSubmission::query()->orderByDesc('created_at');

        if (isset($filters['is_read'])) {
            $query->where('is_read', (bool) $filters['is_read']);
        }

        return $query->paginate($perPage);
    }

    public function markAsRead(ContactSubmission $submission): ContactSubmission
    {
        $submission->update(['is_read' => true]);

        return $submission->fresh();
    }

    public function delete(ContactSubmission $submission): bool
    {
        return (bool) $submission->delete();
    }
}
