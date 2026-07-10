<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrincipalMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
