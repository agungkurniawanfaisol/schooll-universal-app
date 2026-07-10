<?php

use App\Models\WebsiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'splash_screen_enabled'],
            ['value' => ['enabled' => true], 'group' => 'general'],
        );
    }

    public function down(): void
    {
        WebsiteSetting::query()->where('key', 'splash_screen_enabled')->delete();
    }
};
