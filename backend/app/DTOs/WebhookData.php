<?php

namespace App\DTOs;

readonly class WebhookData
{
    public function __construct(public array $attributes) {}

    public static function fromArray(array $data): self
    {
        return new self($data);
    }

    public function toArray(): array
    {
        return $this->attributes;
    }
}
