<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\AbstractPaginator;

trait ApiResponse
{
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200,
        ?array $meta = null,
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $this->transformData($data),
        ];

        if ($meta !== null) {
            $response['meta'] = $meta;
        } elseif ($data instanceof AbstractPaginator) {
            $response['meta'] = [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ];
        }

        return response()->json($response, $status);
    }

    protected function paginatedResource(mixed $paginator, string $resourceClass): JsonResponse
    {
        return $this->success(
            $resourceClass::collection($paginator->items()),
            meta: [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        );
    }

    protected function error(
        string $message = 'Error',
        int $status = 400,
        mixed $data = null,
        ?array $meta = null,
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
            'data' => $data,
        ];

        if ($meta !== null) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $status);
    }

    protected function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function noContent(string $message = 'Deleted successfully'): JsonResponse
    {
        return $this->success(null, $message, 200);
    }

    private function transformData(mixed $data): mixed
    {
        if ($data instanceof JsonResource || $data instanceof ResourceCollection) {
            return $data->resolve();
        }

        if ($data instanceof AbstractPaginator) {
            return $data->items();
        }

        return $data;
    }
}
