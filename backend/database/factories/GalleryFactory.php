<?php

namespace Database\Factories;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Gallery> */
class GalleryFactory extends Factory
{
    protected $model = Gallery::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'cover_image' => null,
            'images' => [],
            'sort_order' => fake()->numberBetween(1, 10),
            'status' => 'published',
        ];
    }
}
