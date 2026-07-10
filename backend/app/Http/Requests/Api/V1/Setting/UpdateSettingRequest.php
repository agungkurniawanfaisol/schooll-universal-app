<?php

namespace App\Http\Requests\Api\V1\Setting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string|max:100',
            'value' => 'nullable',
            'group' => 'nullable|string|max:50',
        ];
    }
}
