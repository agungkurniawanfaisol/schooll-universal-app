<?php

namespace App\Services;

use App\Models\Media;
use App\Repositories\Contracts\MediaRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Throwable;

class MediaService
{
    public function __construct(
        private MediaRepositoryInterface $mediaRepository,
        private ImageManager $imageManager = new ImageManager(new Driver()),
    ) {}

    public function upload(UploadedFile $file, ?int $userId = null, ?string $altText = null, string $disk = 'public'): Media
    {
        $this->assertImageFile($file);

        $uuid = (string) Str::uuid();
        $filename = $uuid.'.jpg';
        $directory = 'media/'.date('Y/m');
        $path = $directory.'/'.$filename;

        $sourcePath = $file->getRealPath();
        if ($sourcePath === false) {
            throw ValidationException::withMessages([
                'file' => ['File upload tidak valid.'],
            ]);
        }

        try {
            $image = $this->imageManager->read($sourcePath);
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'file' => ['File harus berupa gambar yang valid (JPG, PNG, atau WEBP).'],
            ]);
        }

        $maxWidth = (int) config('media.max_width', 4096);
        $maxHeight = (int) config('media.max_height', 4096);

        if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
            throw ValidationException::withMessages([
                'file' => ["Dimensi gambar maksimal {$maxWidth}×{$maxHeight} piksel."],
            ]);
        }

        $outputMaxWidth = (int) config('media.output_max_width', 1920);
        $outputQuality = (int) config('media.output_quality', 85);

        $encoded = $image->scaleDown(width: $outputMaxWidth)->toJpeg(quality: $outputQuality, strip: true);
        Storage::disk($disk)->put($path, (string) $encoded);

        return $this->mediaRepository->create([
            'uuid' => $uuid,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => 'image/jpeg',
            'size' => strlen((string) $encoded),
            'disk' => $disk,
            'path' => $path,
            'alt_text' => $altText,
            'user_id' => $userId,
        ]);
    }

    public function delete(Media $media): bool
    {
        Storage::disk($media->disk)->delete($media->path);

        return $this->mediaRepository->delete($media);
    }

    private function assertImageFile(UploadedFile $file): void
    {
        $allowedMimes = config('media.allowed_mimes', ['image/jpeg', 'image/png', 'image/webp']);
        $mime = $file->getMimeType();

        if (! in_array($mime, $allowedMimes, true)) {
            throw ValidationException::withMessages([
                'file' => ['File harus berupa gambar (JPG, PNG, atau WEBP).'],
            ]);
        }

        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = config('media.allowed_extensions', ['jpg', 'jpeg', 'png', 'webp']);

        if (! in_array($extension, $allowedExtensions, true)) {
            throw ValidationException::withMessages([
                'file' => ['Ekstensi file tidak diizinkan. Gunakan JPG, PNG, atau WEBP.'],
            ]);
        }
    }
}
