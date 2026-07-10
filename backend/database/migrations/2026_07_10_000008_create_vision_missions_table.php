<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vision_missions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['vision', 'mission']);
            $table->string('title');
            $table->text('content');
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('published')->index();
            $table->timestamps();

            $table->index(['type', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vision_missions');
    }
};
