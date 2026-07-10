<?php

namespace App\Enums;

enum PublishStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
            self::Archived => 'Archived',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
