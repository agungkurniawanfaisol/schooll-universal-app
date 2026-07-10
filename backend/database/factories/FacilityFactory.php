<?php

namespace Database\Factories;

use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Facility> */
class FacilityFactory extends Factory
{
    protected $model = Facility::class;

    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'image' => null,
            'icon' => 'building',
            'sort_order' => fake()->numberBetween(1, 10),
            'status' => 'published',
        ];
    }
}
