<?php

namespace App\Models;

use Database\Factories\ContactSubmissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactSubmission extends Model
{
    /** @use HasFactory<ContactSubmissionFactory> */
    use HasFactory;

    protected $table = 'contact_submissions';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'is_read',
        'replied_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'replied_at' => 'datetime',
        ];
    }
}
