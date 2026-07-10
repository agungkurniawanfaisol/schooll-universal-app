<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Teacher> */
class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'slug' => fake()->unique()->slug(),
            'position' => fake()->jobTitle(),
            'subject' => fake()->randomElement(['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS']),
            'biography' => fake()->paragraph(),
            'social_media' => ['instagram' => fake()->url()],
            'sort_order' => fake()->numberBetween(1, 20),
            'status' => 'published',
        ];
    }
}
