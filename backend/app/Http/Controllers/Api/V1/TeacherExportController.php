<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TeacherExportController extends BaseApiController
{
    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()->can('teachers.view'), 403);

        $filename = 'teachers-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function (): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['name', 'nip', 'position', 'subject', 'email', 'status', 'sort_order']);

            Teacher::query()->orderBy('sort_order')->chunk(200, function ($teachers) use ($handle): void {
                foreach ($teachers as $teacher) {
                    fputcsv($handle, [
                        $teacher->name,
                        $teacher->nip,
                        $teacher->position,
                        $teacher->subject,
                        $teacher->email,
                        $teacher->status,
                        $teacher->sort_order,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function import(Request $request)
    {
        abort_unless($request->user()->can('teachers.create'), 403);

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($handle);
        $imported = 0;

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) < 2 || blank($row[0])) {
                continue;
            }

            Teacher::query()->updateOrCreate(
                ['nip' => $row[1] ?: null, 'name' => $row[0]],
                [
                    'position' => $row[2] ?? null,
                    'subject' => $row[3] ?? 'Umum',
                    'email' => $row[4] ?? null,
                    'status' => $row[5] ?? 'published',
                    'sort_order' => (int) ($row[6] ?? 0),
                    'slug' => \Illuminate\Support\Str::slug($row[0]),
                ],
            );
            $imported++;
        }

        fclose($handle);

        return $this->success(['imported' => $imported], "Berhasil mengimpor {$imported} guru");
    }
}
