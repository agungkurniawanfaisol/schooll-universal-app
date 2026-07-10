<?php

namespace App\Http\Requests\Api\V1\Seo;

use App\Models\SeoSetting;
use App\Rules\SafeMediaUrl;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $seo = SeoSetting::query()->where('page_key', $this->route('pageKey'))->first();

        return [
            'page_key' => 'required|string|max:100',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string|max:500',
            'canonical' => 'nullable|string|max:500',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl($seo?->og_image)],
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string',
            'twitter_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl($seo?->twitter_image)],
            'structured_data' => 'nullable|array',
        ];
    }
}
