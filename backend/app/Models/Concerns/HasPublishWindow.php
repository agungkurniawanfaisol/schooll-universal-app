<?php

namespace App\Models\Concerns;

use App\Enums\PublishStatus;
use Illuminate\Database\Eloquent\Builder;

trait HasPublishWindow
{
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PublishStatus::Published->value);
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', PublishStatus::Draft->value);
    }

    public function scopeVisibleNow(Builder $query): Builder
    {
        $now = now();

        return $query
            ->where('status', PublishStatus::Published->value)
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('publish_start_at')->orWhere('publish_start_at', '<=', $now);
            })
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('publish_end_at')->orWhere('publish_end_at', '>=', $now);
            });
    }
}
