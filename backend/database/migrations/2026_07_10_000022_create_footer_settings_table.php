<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('copyright_text')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('status')->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
