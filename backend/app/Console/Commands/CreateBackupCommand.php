<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CreateBackupCommand extends Command
{
    protected $signature = 'backup:create';

    protected $description = 'Create a database backup file';

    public function handle(): int
    {
        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");
        $username = config("database.connections.{$connection}.username");
        $password = config("database.connections.{$connection}.password");
        $host = config("database.connections.{$connection}.host");
        $port = config("database.connections.{$connection}.port", 3306);

        $filename = 'backup-'.now()->format('Y-m-d-His').'.sql';
        $relativePath = 'backups/'.$filename;
        $absolutePath = storage_path('app/'.$relativePath);

        File::ensureDirectoryExists(dirname($absolutePath));

        $passwordArg = $password ? '-p'.escapeshellarg($password) : '';
        $command = sprintf(
            'mysqldump -h %s -P %s -u %s %s %s > %s',
            escapeshellarg($host),
            escapeshellarg((string) $port),
            escapeshellarg($username),
            $passwordArg,
            escapeshellarg($database),
            escapeshellarg($absolutePath),
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0 || ! File::exists($absolutePath)) {
            $this->error('Backup failed.');

            return self::FAILURE;
        }

        Storage::disk('local')->put('backups/latest.txt', $relativePath);
        $this->info($relativePath);

        return self::SUCCESS;
    }
}
