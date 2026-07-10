<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_menus', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_external')->default(false);
            $table->foreignId('parent_id')->nullable()->constrained('navigation_menus')->nullOnDelete();
            $table->timestamps();

            $table->index(['parent_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_menus');
    }
};
