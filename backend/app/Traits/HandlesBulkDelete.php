<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait HandlesBulkDelete
{
    abstract protected function bulkDeleteModelClass(): string;

    abstract protected function bulkDeleteItem(Model $model): void;

    public function bulkDestroy(Request $request): JsonResponse
    {
        $ids = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer',
        ])['ids'];

        $class = $this->bulkDeleteModelClass();

        foreach ($ids as $id) {
            /** @var Model|null $model */
            $model = $class::query()->find($id);
            if (! $model) {
                continue;
            }

            $this->authorize('delete', $model);
            $this->bulkDeleteItem($model);
        }

        return $this->noContent('Deleted successfully');
    }
}
