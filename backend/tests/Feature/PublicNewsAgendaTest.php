<?php

namespace Tests\Feature;

use App\Models\Agenda;
use App\Models\News;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PublicNewsAgendaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_public_news_is_paginated_and_respects_visibility_window(): void
    {
        News::query()->create([
            'title' => 'Berita Visible',
            'slug' => 'berita-visible',
            'excerpt' => 'Excerpt visible',
            'content' => 'Content visible',
            'status' => 'published',
            'publish_start_at' => now()->subDay(),
            'publish_end_at' => now()->addDay(),
            'published_at' => now()->subDay(),
        ]);

        News::query()->create([
            'title' => 'Berita Expired',
            'slug' => 'berita-expired',
            'excerpt' => 'Excerpt expired',
            'content' => 'Content expired',
            'status' => 'published',
            'publish_start_at' => now()->subDays(10),
            'publish_end_at' => now()->subDay(),
            'published_at' => now()->subDays(10),
        ]);

        $response = $this->getJson('/api/v1/public/news?per_page=5');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonFragment(['slug' => 'berita-visible']);

        $this->getJson('/api/v1/public/news/berita-expired')
            ->assertNotFound();
    }

    public function test_public_agenda_detail_requires_visibility(): void
    {
        Agenda::query()->create([
            'title' => 'Agenda Aktif',
            'slug' => 'agenda-aktif',
            'date' => now()->addDays(3)->toDateString(),
            'status' => 'published',
            'publish_start_at' => now()->subDay(),
            'publish_end_at' => null,
        ]);

        $this->getJson('/api/v1/public/agendas/agenda-aktif')
            ->assertOk()
            ->assertJsonPath('data.slug', 'agenda-aktif');
    }

    public function test_admin_news_list_supports_date_filter(): void
    {
        $role = Role::query()->where('name', 'Super Admin')->firstOrFail();
        $user = User::query()->create([
            'name' => 'Admin Test',
            'email' => 'admin-test@sekolah.test',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $user->assignRole($role);

        News::query()->create([
            'title' => 'Old News',
            'slug' => 'old-news',
            'excerpt' => 'Old',
            'content' => 'Old content',
            'status' => 'published',
            'publish_start_at' => '2025-01-15 10:00:00',
            'published_at' => '2025-01-15 10:00:00',
        ]);

        News::query()->create([
            'title' => 'Recent News',
            'slug' => 'recent-news',
            'excerpt' => 'Recent',
            'content' => 'Recent content',
            'status' => 'published',
            'publish_start_at' => '2026-06-01 10:00:00',
            'published_at' => '2026-06-01 10:00:00',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/news?date_from=2026-01-01&date_to=2026-12-31');

        $response->assertOk()
            ->assertJsonFragment(['slug' => 'recent-news']);

        $slugs = collect($response->json('data'))->pluck('slug');
        $this->assertFalse($slugs->contains('old-news'));
    }
}
