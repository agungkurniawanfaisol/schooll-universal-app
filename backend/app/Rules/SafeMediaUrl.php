<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Storage;

class SafeMediaUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value) || ! self::isAllowed($value)) {
            $fail('The :attribute must be a valid uploaded media URL.');
        }
    }

    public static function isAllowed(string $value): bool
    {
        $value = trim($value);

        if ($value === '' || ! SafeUrl::isSafe($value)) {
            return false;
        }

        if (str_starts_with($value, '/storage/media/')) {
            return true;
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($value);
            if ($parsed === false) {
                return false;
            }

            $path = $parsed['path'] ?? '';
            if (! str_starts_with($path, '/storage/media/')) {
                return false;
            }

            $appHost = parse_url(rtrim((string) config('app.url'), '/'), PHP_URL_HOST);
            $valueHost = $parsed['host'] ?? null;

            return $appHost !== null && $valueHost !== null && strcasecmp($appHost, $valueHost) === 0;
        }

        $storagePrefix = rtrim(Storage::disk('public')->url('media'), '/');

        return str_starts_with($value, $storagePrefix);
    }
}
