<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Activity> */
class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'image' => null,
            'date' => fake()->date(),
            'sort_order' => fake()->numberBetween(1, 10),
            'status' => 'published',
        ];
    }
}
