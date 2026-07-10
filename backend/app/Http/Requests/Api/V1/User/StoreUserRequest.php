<?php

namespace App\Http\Requests\Api\V1\User;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'avatar' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'status' => 'nullable|in:active,inactive',
            'roles' => 'nullable|array',
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ];
    }
}
