<?php

namespace App\Http\Requests\Api\V1\Teacher;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'biography' => 'nullable|string',
            'photo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'social_media' => 'nullable|array',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
