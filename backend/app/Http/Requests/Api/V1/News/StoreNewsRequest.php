<?php

namespace App\Http\Requests\Api\V1\News;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
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
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'published_at' => 'nullable|date',
            'publish_start_at' => 'nullable|date',
            'publish_end_at' => 'nullable|date|after_or_equal:publish_start_at',
            'status' => 'required|in:draft,published,archived',
        ];
    }
}
