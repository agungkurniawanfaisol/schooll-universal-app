<?php

namespace App\Http\Requests\Api\V1\Gallery;

use App\Rules\SafeMediaUrl;
use App\Rules\SafeMediaUrlInList;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
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
            'cover_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl($this->route('gallery')?->cover_image)],
            'images' => 'nullable|array|max:'.config('media.max_album_images', 20),
            'images.*' => ['string', 'max:500', new SafeMediaUrlInList($this->route('gallery')?->images ?? [])],
            'sort_order' => 'nullable|integer',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
