<?php

namespace App\Http\Requests\Api\V1\Setting;

use App\Models\WebsiteSetting;
use App\Services\SettingValueValidator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

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

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $key = (string) $this->input('key');
            $existing = WebsiteSetting::query()->where('key', $key)->first();

            try {
                app(SettingValueValidator::class)->validate($key, $this->input('value'), $existing);
            } catch (ValidationException $exception) {
                foreach ($exception->errors()['value'] ?? [] as $message) {
                    $validator->errors()->add('value', $message);
                }
            }
        });
    }
}
