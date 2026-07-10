<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->string('thumbnail')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->date('date');
            $table->time('time')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('published')->index();
            $table->timestamps();

            $table->index(['status', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
