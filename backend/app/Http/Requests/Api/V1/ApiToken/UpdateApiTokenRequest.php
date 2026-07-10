<?php

namespace App\Http\Requests\Api\V1\ApiToken;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApiTokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => 'nullable|integer|exists:tenants,id',
            'name' => 'sometimes|string|max:255',
            'abilities' => 'nullable|array',
            'abilities.*' => 'string|max:100',
            'is_active' => 'nullable|boolean',
        ];
    }
}
