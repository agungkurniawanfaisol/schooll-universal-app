<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends BaseApiController
{
    public function create(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('backup.view'), 403);

        Artisan::call('backup:create');
        $path = trim(Artisan::output());

        if ($path === '' || ! Storage::disk('local')->exists($path)) {
            return $this->error('Backup creation failed', 500);
        }

        return $this->success(['path' => $path], 'Backup created successfully');
    }

    public function download(Request $request): StreamedResponse|JsonResponse
    {
        abort_unless($request->user()->can('backup.view'), 403);

        $path = $request->get('path');
        if (! $path && Storage::disk('local')->exists('backups/latest.txt')) {
            $path = trim(Storage::disk('local')->get('backups/latest.txt'));
        }

        if (! $path || ! Storage::disk('local')->exists($path)) {
            return $this->error('Backup file not found', 404);
        }

        return Storage::disk('local')->download($path);
    }
}
