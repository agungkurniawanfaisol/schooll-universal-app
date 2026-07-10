<?php

namespace App\Services;

use App\DTOs\PpdbRegistrationData;
use App\Models\PpdbRegistration;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PpdbService
{
    public function __construct(private WebhookDispatcher $webhookDispatcher) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = PpdbRegistration::query()->orderByDesc('created_at');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('registration_number', 'like', "%{$search}%")
                    ->orWhere('student_name', 'like', "%{$search}%")
                    ->orWhere('parent_name', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?PpdbRegistration
    {
        return PpdbRegistration::query()->find($id);
    }

    public function findByRegistrationNumber(string $registrationNumber): ?PpdbRegistration
    {
        return PpdbRegistration::query()
            ->where('registration_number', $registrationNumber)
            ->first();
    }

    public function submit(PpdbRegistrationData $data): PpdbRegistration
    {
        $attrs = $data->toArray();
        $attrs['registration_number'] = $this->generateRegistrationNumber();
        $attrs['status'] = $attrs['status'] ?? 'pending';

        $registration = PpdbRegistration::query()->create($attrs);
        $this->webhookDispatcher->dispatch('ppdb.created', $registration->toArray());

        return $registration;
    }

    public function updateStatus(PpdbRegistration $registration, string $status, ?string $adminNotes = null, ?int $reviewedBy = null): PpdbRegistration
    {
        $registration->update([
            'status' => $status,
            'admin_notes' => $adminNotes ?? $registration->admin_notes,
            'reviewed_by' => $reviewedBy,
            'reviewed_at' => now(),
        ]);

        return $registration->fresh();
    }

    private function generateRegistrationNumber(): string
    {
        $prefix = 'PPDB-'.now()->format('Y');
        $latest = PpdbRegistration::query()
            ->where('registration_number', 'like', "{$prefix}-%")
            ->orderByDesc('registration_number')
            ->value('registration_number');

        $sequence = 1;
        if ($latest && preg_match('/-(\d+)$/', $latest, $matches)) {
            $sequence = (int) $matches[1] + 1;
        }

        return sprintf('%s-%05d', $prefix, $sequence);
    }
}
