<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\Support\CreatesUploadFixtures;
use Tests\TestCase;

class MediaUploadSecurityTest extends TestCase
{
    use CreatesUploadFixtures;
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->seed(RolePermissionSeeder::class);

        $role = Role::query()->where('name', 'Super Admin')->firstOrFail();
        $this->admin = User::query()->create([
            'name' => 'Admin Upload',
            'email' => 'upload-admin@sekolah.test',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
        $this->admin->assignRole($role);
    }

    public function test_valid_jpeg_upload_is_stored_as_jpeg(): void
    {
        $file = $this->jpegFixture('photo.jpg');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file]);

        $response->assertCreated()
            ->assertJsonPath('data.mime_type', 'image/jpeg');

        $path = $response->json('data.path');
        $this->assertNotNull($path);
        $this->assertStringEndsWith('.jpg', (string) $response->json('data.filename'));
        Storage::disk('public')->assertExists($path);
    }

    public function test_valid_png_upload_is_reencoded_to_jpeg(): void
    {
        $file = $this->pngFixture('photo.png');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file]);

        $response->assertCreated()
            ->assertJsonPath('data.mime_type', 'image/jpeg');
    }

    public function test_rejects_file_larger_than_max_size(): void
    {
        $file = UploadedFile::fake()->create('large.jpg', 6000, 'image/jpeg');

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_rejects_php_disguised_as_image(): void
    {
        $file = UploadedFile::fake()->create('evil.php', 100, 'image/jpeg');
        file_put_contents($file->getRealPath(), "<?php echo 'x'; ?>");

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file])
            ->assertUnprocessable();
    }

    public function test_rejects_svg_upload(): void
    {
        $file = UploadedFile::fake()->create('icon.svg', 10, 'image/svg+xml');

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file])
            ->assertUnprocessable();
    }

    public function test_rejects_oversized_dimensions(): void
    {
        if (! function_exists('imagejpeg')) {
            $this->markTestSkipped('GD JPEG support required for dimension test.');
        }

        $file = UploadedFile::fake()->image('huge.jpg', 5000, 5000);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_rejects_unauthenticated_upload(): void
    {
        $file = $this->jpegFixture();

        $this->postJson('/api/v1/media', ['file' => $file])
            ->assertUnauthorized();
    }

    public function test_rejects_user_without_media_permission(): void
    {
        $user = User::query()->create([
            'name' => 'No Perm',
            'email' => 'noperm@sekolah.test',
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);

        $file = $this->jpegFixture();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $file])
            ->assertForbidden();
    }

    public function test_teacher_store_rejects_external_photo_url(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/teachers', [
                'name' => 'Guru Test',
                'subject' => 'Matematika',
                'status' => 'published',
                'photo' => 'https://evil.example.com/photo.jpg',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['photo']);
    }

    public function test_gallery_store_rejects_external_cover_image(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/galleries', [
                'title' => 'Album Test',
                'status' => 'published',
                'cover_image' => 'https://evil.example.com/cover.jpg',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['cover_image']);
    }

    public function test_teacher_store_accepts_internal_media_url(): void
    {
        $upload = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/media', ['file' => $this->jpegFixture('guru.jpg')])
            ->assertCreated();

        $url = $upload->json('data.url');

        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/teachers', [
                'name' => 'Guru Foto',
                'subject' => 'IPA',
                'status' => 'published',
                'photo' => $url,
            ])
            ->assertCreated()
            ->assertJsonPath('data.photo', $url);
    }
}
