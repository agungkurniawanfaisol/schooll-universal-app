<?php

namespace App\Http\Requests\Api\V1\Content;

use App\Models\AboutSchool;
use App\Rules\SafeMediaUrl;
use App\Rules\SafeUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutSchoolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl(AboutSchool::query()->value('image'))],
            'video_url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'status' => 'nullable|in:draft,published,archived',
        ];
    }
}
