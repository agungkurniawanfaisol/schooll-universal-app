<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DownloadDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        if (isset($data['file_path'])) {
            $data['file_url'] = media_url($data['file_path']);
        }

        return $data;
    }
}
