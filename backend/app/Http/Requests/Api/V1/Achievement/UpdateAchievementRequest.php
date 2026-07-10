<?php

namespace App\Http\Requests\Api\V1\Achievement;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAchievementRequest extends FormRequest
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
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'year' => 'nullable|integer|min:1900|max:2100',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
