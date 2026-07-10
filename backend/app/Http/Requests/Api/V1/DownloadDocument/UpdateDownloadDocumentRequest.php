<?php

namespace App\Http\Requests\Api\V1\DownloadDocument;

use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDownloadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => 'nullable|integer|exists:tenants,id',
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'file_path' => ['sometimes', 'string', 'max:500', new SafeMediaUrl($this->route('download_document')?->file_path)],
            'category' => 'nullable|string|max:100',
            'status' => 'sometimes|in:draft,published,archived',
            'sort_order' => 'nullable|integer',
        ];
    }
}
