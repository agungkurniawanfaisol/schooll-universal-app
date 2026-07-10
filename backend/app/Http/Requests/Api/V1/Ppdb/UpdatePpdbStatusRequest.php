<?php

namespace App\Http\Requests\Api\V1\Ppdb;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePpdbStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
        ];
    }
}
