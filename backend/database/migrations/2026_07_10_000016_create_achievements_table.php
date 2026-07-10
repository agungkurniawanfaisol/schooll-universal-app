<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->year('year')->nullable();
            $table->string('category')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('published')->index();
            $table->timestamps();

            $table->index(['year', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
