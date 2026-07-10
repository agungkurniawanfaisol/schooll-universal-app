<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\PpdbRegistrationData;
use App\Http\Requests\Api\V1\Ppdb\SubmitPpdbRequest;
use App\Http\Requests\Api\V1\Ppdb\UpdatePpdbStatusRequest;
use App\Http\Resources\PpdbRegistrationResource;
use App\Models\PpdbRegistration;
use App\Services\PpdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PpdbController extends BaseApiController
{
    public function __construct(private PpdbService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PpdbRegistration::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(PpdbRegistrationResource::collection($items));
    }

    public function show(PpdbRegistration $ppdbRegistration): JsonResponse
    {
        $this->authorize('view', $ppdbRegistration);

        return $this->success(new PpdbRegistrationResource($ppdbRegistration));
    }

    public function updateStatus(UpdatePpdbStatusRequest $request, PpdbRegistration $ppdbRegistration): JsonResponse
    {
        $this->authorize('update', $ppdbRegistration);
        $registration = $this->service->updateStatus(
            $ppdbRegistration,
            $request->validated('status'),
            $request->validated('admin_notes'),
            $request->user()?->id,
        );

        return $this->success(new PpdbRegistrationResource($registration), 'Status updated successfully');
    }

    public function submit(SubmitPpdbRequest $request): JsonResponse
    {
        $registration = $this->service->submit(PpdbRegistrationData::fromArray($request->validated()));

        return $this->created(new PpdbRegistrationResource($registration), 'Pendaftaran berhasil dikirim');
    }

    public function checkStatus(string $registrationNumber): JsonResponse
    {
        $registration = $this->service->findByRegistrationNumber($registrationNumber);

        if (! $registration) {
            return $this->error('Nomor pendaftaran tidak ditemukan', 404);
        }

        return $this->success([
            'registration_number' => $registration->registration_number,
            'student_name' => $registration->student_name,
            'status' => $registration->status,
            'reviewed_at' => $registration->reviewed_at,
        ]);
    }
}
