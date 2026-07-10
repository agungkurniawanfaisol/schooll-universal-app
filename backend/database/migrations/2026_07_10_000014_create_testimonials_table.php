<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('photo')->nullable();
            $table->string('name');
            $table->string('occupation')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('comment');
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('published')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
