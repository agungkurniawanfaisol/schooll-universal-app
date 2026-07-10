<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Testimonial> */
class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'occupation' => fake()->jobTitle(),
            'photo' => null,
            'rating' => 5,
            'comment' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(1, 10),
            'status' => 'published',
        ];
    }
}
