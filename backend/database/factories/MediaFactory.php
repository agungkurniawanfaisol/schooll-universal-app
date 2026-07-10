<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Media> */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'filename' => fake()->uuid().'.jpg',
            'original_name' => fake()->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(10000, 500000),
            'disk' => 'public',
            'path' => 'media/sample.jpg',
            'alt_text' => fake()->sentence(3),
            'user_id' => null,
        ];
    }
}
