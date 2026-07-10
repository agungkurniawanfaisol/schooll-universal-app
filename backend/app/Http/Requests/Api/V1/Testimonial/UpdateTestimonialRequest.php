<?php

namespace App\Http\Requests\Api\V1\Testimonial;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'photo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'sometimes|string',
            'sort_order' => 'nullable|integer',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
