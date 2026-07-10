<?php

namespace App\DTOs\Content;

readonly class HeroSectionData
{
    public function __construct(public array $attributes) {}

    public function toArray(): array
    {
        return $this->attributes;
    }
}
