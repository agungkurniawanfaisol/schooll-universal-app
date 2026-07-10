<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeMediaUrlInList implements ValidationRule
{
    /** @param  array<int, string|null>  $allowedExisting */
    public function __construct(private array $allowedExisting = []) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value)) {
            $fail('The :attribute must be a valid uploaded media URL.');

            return;
        }

        if (in_array($value, $this->allowedExisting, true)) {
            return;
        }

        if (! SafeMediaUrl::isAllowed($value)) {
            $fail('The :attribute must be a valid uploaded media URL.');
        }
    }
}
