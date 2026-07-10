<?php

namespace App\Services;

use App\Models\WebsiteSetting;
use App\Rules\SafeMediaUrl;
use App\Rules\SafeUrl;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SettingValueValidator
{
    public function validate(string $key, mixed $value, ?WebsiteSetting $existing = null): void
    {
        match ($key) {
            'school_logo' => $this->validateMediaUrlValue($value, data_get($existing?->value, 'url')),
            'ppdb_url' => $this->validateSafeUrlValue($value),
            'school_name', 'school_tagline' => $this->validateTextValue($value),
            'splash_screen_enabled' => $this->validateBooleanValue($value),
            'hero_stats' => $this->validateHeroStats($value),
            default => null,
        };
    }

    private function validateMediaUrlValue(mixed $value, mixed $unchanged = null): void
    {
        $url = $this->extractUrl($value);

        $validator = Validator::make(
            ['url' => $url],
            ['url' => ['nullable', 'string', 'max:500', new SafeMediaUrl($unchanged)]],
        );

        $this->throwIfInvalid($validator);
    }

    private function validateSafeUrlValue(mixed $value): void
    {
        $url = $this->extractUrl($value);

        $validator = Validator::make(
            ['url' => $url],
            ['url' => ['nullable', 'string', 'max:500', new SafeUrl]],
        );

        $this->throwIfInvalid($validator);
    }

    private function validateTextValue(mixed $value): void
    {
        $text = is_array($value) ? ($value['text'] ?? null) : (is_string($value) ? $value : null);

        $validator = Validator::make(
            ['text' => $text],
            ['text' => ['nullable', 'string', 'max:255']],
        );

        $this->throwIfInvalid($validator);
    }

    private function validateBooleanValue(mixed $value): void
    {
        $enabled = $this->extractBoolean($value);

        $validator = Validator::make(
            ['enabled' => $enabled],
            ['enabled' => ['required', 'boolean']],
        );

        $this->throwIfInvalid($validator);
    }

    private function extractBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_array($value) && array_key_exists('enabled', $value)) {
            return filter_var($value['enabled'], FILTER_VALIDATE_BOOLEAN);
        }

        return false;
    }

    private function validateHeroStats(mixed $value): void
    {
        if ($value === null) {
            return;
        }

        $validator = Validator::make(
            ['hero_stats' => $value],
            [
                'hero_stats' => ['array', 'max:12'],
                'hero_stats.*.label' => ['required', 'string', 'max:100'],
                'hero_stats.*.value' => ['required', 'integer', 'min:0', 'max:9999999'],
                'hero_stats.*.suffix' => ['nullable', 'string', 'max:10'],
            ],
        );

        $this->throwIfInvalid($validator);
    }

    private function extractUrl(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            return $value === '' ? null : $value;
        }

        if (is_array($value)) {
            $url = $value['url'] ?? null;

            return $url === '' || $url === null ? null : (string) $url;
        }

        return null;
    }

    private function throwIfInvalid(\Illuminate\Validation\Validator $validator): void
    {
        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'value' => $validator->errors()->all(),
            ]);
        }
    }
}
