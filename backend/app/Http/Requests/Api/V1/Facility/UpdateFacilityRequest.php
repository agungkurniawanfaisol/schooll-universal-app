<?php

namespace App\Http\Requests\Api\V1\Facility;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl($this->route('facility')?->image)],
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
