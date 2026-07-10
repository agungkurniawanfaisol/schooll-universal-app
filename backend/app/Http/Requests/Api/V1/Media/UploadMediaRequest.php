<?php

namespace App\Http\Requests\Api\V1\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $maxKb = (int) config('media.max_upload_kb', 5120);
        $extensions = config('media.allowed_extensions', ['jpg', 'jpeg', 'png', 'webp']);

        return [
            'file' => [
                'required',
                File::image()
                    ->types($extensions)
                    ->max($maxKb),
            ],
            'alt_text' => 'nullable|string|max:255',
            'context' => 'nullable|string|in:default,logo',
        ];
    }
}
