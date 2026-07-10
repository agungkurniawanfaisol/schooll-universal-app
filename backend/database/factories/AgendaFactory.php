<?php

namespace Database\Factories;

use App\Models\Agenda;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Agenda> */
class AgendaFactory extends Factory
{
    protected $model = Agenda::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(),
            'thumbnail' => null,
            'date' => fake()->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'time' => '08:00:00',
            'location' => fake()->address(),
            'description' => fake()->paragraph(),
            'publish_start_at' => now(),
            'publish_end_at' => null,
            'status' => 'published',
        ];
    }
}
