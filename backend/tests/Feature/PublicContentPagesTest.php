<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Teacher;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_public_teachers_is_paginated_and_excludes_drafts(): void
    {
        Teacher::query()->create([
            'name' => 'Guru Published',
            'slug' => 'guru-published',
            'position' => 'Guru Matematika',
            'subject' => 'Matematika',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        Teacher::query()->create([
            'name' => 'Guru Draft',
            'slug' => 'guru-draft',
            'position' => 'Guru IPA',
            'subject' => 'IPA',
            'status' => 'draft',
            'sort_order' => 2,
        ]);

        $response = $this->getJson('/api/v1/public/teachers?per_page=1');

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('data.0.slug', 'guru-published');
    }

    public function test_public_teacher_detail_returns_404_for_draft(): void
    {
        Teacher::query()->create([
            'name' => 'Guru Draft',
            'slug' => 'guru-draft',
            'position' => 'Guru IPA',
            'status' => 'draft',
        ]);

        $this->getJson('/api/v1/public/teachers/guru-draft')
            ->assertNotFound();
    }

    public function test_public_teacher_detail_returns_published_teacher(): void
    {
        Teacher::query()->create([
            'name' => 'Guru Published',
            'slug' => 'guru-published',
            'position' => 'Guru Matematika',
            'biography' => 'Bio lengkap',
            'status' => 'published',
        ]);

        $this->getJson('/api/v1/public/teachers/guru-published')
            ->assertOk()
            ->assertJsonPath('data.slug', 'guru-published')
            ->assertJsonPath('data.biography', 'Bio lengkap');
    }

    public function test_public_activities_is_paginated_and_excludes_drafts(): void
    {
        Activity::query()->create([
            'title' => 'Kegiatan Published',
            'slug' => 'kegiatan-published',
            'description' => 'Deskripsi',
            'date' => now()->toDateString(),
            'status' => 'published',
        ]);

        Activity::query()->create([
            'title' => 'Kegiatan Draft',
            'slug' => 'kegiatan-draft',
            'description' => 'Draft',
            'date' => now()->toDateString(),
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/v1/public/activities');

        $response->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'kegiatan-published');
    }

    public function test_public_activity_detail_returns_404_for_draft(): void
    {
        Activity::query()->create([
            'title' => 'Kegiatan Draft',
            'slug' => 'kegiatan-draft',
            'date' => now()->toDateString(),
            'status' => 'draft',
        ]);

        $this->getJson('/api/v1/public/activities/kegiatan-draft')
            ->assertNotFound();
    }

    public function test_public_vision_mission_returns_published_items(): void
    {
        \App\Models\VisionMission::query()->create([
            'type' => 'vision',
            'title' => 'Visi Kami',
            'content' => 'Menjadi sekolah unggulan',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        \App\Models\VisionMission::query()->create([
            'type' => 'mission',
            'title' => 'Misi Draft',
            'content' => 'Tidak tampil',
            'status' => 'draft',
            'sort_order' => 2,
        ]);

        $this->getJson('/api/v1/public/vision-mission')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Visi Kami');
    }
}
