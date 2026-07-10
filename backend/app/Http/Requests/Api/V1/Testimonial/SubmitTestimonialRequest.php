<?php

namespace App\Http\Requests\Api\V1\Testimonial;

use Illuminate\Foundation\Http\FormRequest;

class SubmitTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:2000',
            'submitter_email' => 'nullable|email|max:255',
        ];
    }
}
