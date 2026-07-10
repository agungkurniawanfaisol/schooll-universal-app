<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('alt_text')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['mime_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
