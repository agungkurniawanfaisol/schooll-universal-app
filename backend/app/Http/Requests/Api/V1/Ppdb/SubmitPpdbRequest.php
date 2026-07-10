<?php

namespace App\Http\Requests\Api\V1\Ppdb;

use Illuminate\Foundation\Http\FormRequest;

class SubmitPpdbRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => 'nullable|integer|exists:tenants,id',
            'student_name' => 'required|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:30',
            'parent_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'previous_school' => 'nullable|string|max:255',
            'documents' => 'nullable|array',
        ];
    }
}
