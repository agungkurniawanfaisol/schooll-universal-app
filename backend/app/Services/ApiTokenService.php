<?php

namespace App\Services;

use App\DTOs\ApiTokenData;
use App\Models\ApiToken;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ApiTokenService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = ApiToken::query()->orderByDesc('created_at');

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?ApiToken
    {
        return ApiToken::query()->find($id);
    }

    /** @return array{token: ApiToken, plain_text_token: string} */
    public function create(ApiTokenData $data): array
    {
        $plainTextToken = Str::random(64);
        $attrs = $data->toArray();
        $attrs['token'] = hash('sha256', $plainTextToken);

        $token = ApiToken::query()->create($attrs);

        return [
            'token' => $token,
            'plain_text_token' => $plainTextToken,
        ];
    }

    public function update(ApiToken $token, ApiTokenData $data): ApiToken
    {
        $token->update($data->toArray());

        return $token->fresh();
    }

    public function delete(ApiToken $token): bool
    {
        return (bool) $token->delete();
    }

    /** @return array{token: ApiToken, plain_text_token: string} */
    public function regenerate(ApiToken $token): array
    {
        $plainTextToken = Str::random(64);
        $token->update(['token' => hash('sha256', $plainTextToken)]);

        return [
            'token' => $token->fresh(),
            'plain_text_token' => $plainTextToken,
        ];
    }
}
