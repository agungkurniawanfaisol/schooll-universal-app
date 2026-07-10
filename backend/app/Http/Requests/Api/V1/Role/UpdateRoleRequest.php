<?php

namespace App\Http\Requests\Api\V1\Role;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ];
    }
}
