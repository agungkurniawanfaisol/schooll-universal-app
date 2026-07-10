<?php

namespace App\Http\Requests\Api\V1\Content;

use App\Rules\SafeMediaUrl;
use App\Rules\SafeUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'background_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl($this->route('heroSection')?->background_image)],
            'cta_text' => 'nullable|string|max:100',
            'cta_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'status' => 'nullable|in:draft,published,archived',
            'sort_order' => 'nullable|integer',
        ];
    }
}
