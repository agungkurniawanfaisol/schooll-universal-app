<?php

namespace App\Http\Requests\Api\V1\Activity;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'date' => 'nullable|date',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:draft,published,archived',
        ];
    }
}
