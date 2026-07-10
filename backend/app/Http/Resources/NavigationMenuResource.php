<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'children' => NavigationMenuResource::collection($this->whenLoaded('children')),
        ]);
    }
}
