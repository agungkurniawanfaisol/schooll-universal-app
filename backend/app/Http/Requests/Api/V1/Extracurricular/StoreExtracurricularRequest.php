<?php

namespace App\Http\Requests\Api\V1\Extracurricular;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreExtracurricularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => 'nullable|integer|exists:tenants,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'schedule' => 'nullable|string|max:255',
            'coach' => 'nullable|string|max:255',
            'members' => 'nullable|array',
            'members.*' => 'string|max:255',
            'status' => 'required|in:draft,published,archived',
            'sort_order' => 'nullable|integer',
        ];
    }
}
