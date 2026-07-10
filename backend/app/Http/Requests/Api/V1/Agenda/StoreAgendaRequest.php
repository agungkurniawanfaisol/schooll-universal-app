<?php

namespace App\Http\Requests\Api\V1\Agenda;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreAgendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:date',
            'time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'publish_start_at' => 'nullable|date',
            'publish_end_at' => 'nullable|date|after_or_equal:publish_start_at',
            'status' => 'required|in:draft,published,archived',
        ];
    }
}
