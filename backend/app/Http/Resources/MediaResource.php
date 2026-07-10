<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'url' => media_url($this->path, $this->disk),
        ]);
    }
}
