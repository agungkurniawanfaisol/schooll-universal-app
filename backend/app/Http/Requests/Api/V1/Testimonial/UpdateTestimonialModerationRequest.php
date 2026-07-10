<?php

namespace App\Http\Requests\Api\V1\Testimonial;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialModerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'moderation_status' => 'required|in:approved,rejected',
            'status' => 'nullable|in:draft,published,archived',
        ];
    }
}
