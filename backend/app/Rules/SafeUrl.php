<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value) || ! self::isSafe($value)) {
            $fail('The :attribute must be a safe URL.');
        }
    }

    public static function isSafe(string $value): bool
    {
        $value = trim($value);

        if ($value === '') {
            return true;
        }

        if (preg_match('/^\s*(javascript|data|vbscript):/i', $value)) {
            return false;
        }

        if (str_starts_with($value, '/') || str_starts_with($value, '#')) {
            return ! preg_match('/(javascript|data|vbscript):/i', $value);
        }

        $parsed = parse_url($value);
        if ($parsed === false) {
            return false;
        }

        $scheme = strtolower($parsed['scheme'] ?? '');

        if ($scheme === '') {
            return ! preg_match('/^(javascript|data|vbscript):/i', $value);
        }

        return in_array($scheme, ['http', 'https', 'mailto', 'tel'], true);
    }
}
