<?php

namespace App\Http\Requests\Api\V1\Auth;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $user = $this->user();

        return [
            'name' => 'sometimes|string|max:255',
            'avatar' => ['nullable', 'string', 'max:500', new SafeMediaUrl($user?->avatar)],
            'password' => ['nullable', 'confirmed', Password::min(6)],
            'current_password' => ['required_with:password', 'current_password'],
        ];
    }
}
