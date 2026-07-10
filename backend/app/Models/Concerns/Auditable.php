<?php

namespace App\Models\Concerns;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function (Model $model): void {
            static::logAudit('created', $model, null, $model->getAttributes());
        });

        static::updated(function (Model $model): void {
            static::logAudit('updated', $model, $model->getOriginal(), $model->getChanges());
        });

        static::deleted(function (Model $model): void {
            static::logAudit('deleted', $model, $model->getAttributes(), null);
        });
    }

  /** @param array<string, mixed>|null $oldValues */
  /** @param array<string, mixed>|null $newValues */
    protected static function logAudit(string $action, Model $model, ?array $oldValues, ?array $newValues): void
    {
        ActivityLog::query()->create([
            'tenant_id' => $model->tenant_id ?? null,
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $model::class,
            'model_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()?->ip(),
        ]);
    }
}
