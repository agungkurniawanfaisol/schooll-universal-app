<?php

namespace Database\Factories;

use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Achievement> */
class AchievementFactory extends Factory
{
    protected $model = Achievement::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'image' => null,
            'year' => fake()->numberBetween(2018, 2026),
            'category' => fake()->randomElement(['Akademik', 'Olahraga', 'Seni']),
            'sort_order' => fake()->numberBetween(1, 10),
            'status' => 'published',
        ];
    }
}
