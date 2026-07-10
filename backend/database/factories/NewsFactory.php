<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<News> */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(5),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->text(150),
            'content' => fake()->paragraphs(3, true),
            'thumbnail' => null,
            'published_at' => now(),
            'publish_start_at' => now(),
            'publish_end_at' => null,
            'status' => 'published',
        ];
    }
}
