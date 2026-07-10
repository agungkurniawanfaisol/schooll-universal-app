<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->timestamp('publish_start_at')->nullable()->after('published_at')->index();
            $table->timestamp('publish_end_at')->nullable()->after('publish_start_at')->index();
        });

        Schema::table('agendas', function (Blueprint $table) {
            $table->date('end_date')->nullable()->after('date');
            $table->timestamp('publish_start_at')->nullable()->after('status')->index();
            $table->timestamp('publish_end_at')->nullable()->after('publish_start_at')->index();
        });

        DB::table('news')->whereNotNull('published_at')->update([
            'publish_start_at' => DB::raw('published_at'),
        ]);

        DB::table('agendas')->update([
            'publish_start_at' => DB::raw('created_at'),
        ]);
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['publish_start_at', 'publish_end_at']);
        });

        Schema::table('agendas', function (Blueprint $table) {
            $table->dropColumn(['end_date', 'publish_start_at', 'publish_end_at']);
        });
    }
};
