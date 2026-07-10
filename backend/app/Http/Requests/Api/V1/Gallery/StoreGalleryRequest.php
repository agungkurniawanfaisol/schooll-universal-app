<?php

namespace App\Http\Requests\Api\V1\Gallery;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryRequest extends FormRequest
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
            'cover_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'images' => 'nullable|array|max:'.config('media.max_album_images', 20),
            'images.*' => ['string', 'max:500', new SafeMediaUrl],
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:draft,published,archived',
        ];
    }
}
