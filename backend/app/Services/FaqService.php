<?php

namespace App\Services;

use App\DTOs\FaqData;
use App\Models\Faq;
use App\Repositories\Contracts\FaqRepositoryInterface;
use App\Support\HtmlSanitizer;
use Illuminate\Database\Eloquent\Model;

class FaqService
{
    public function __construct(private FaqRepositoryInterface $repository) {}

    public function list(array $filters = [], int $perPage = 15)
    {
        if (! empty($filters['all'])) {
            return $this->repository->all($filters);
        }

        return $this->repository->paginate($filters, $perPage);
    }

    public function find(int $id): ?Model
    {
        return $this->repository->find($id);
    }

    public function create(FaqData $data): Model
    {
        $attrs = $data->toArray();
        if (array_key_exists('answer', $attrs)) {
            $attrs['answer'] = HtmlSanitizer::clean($attrs['answer']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Faq $model, FaqData $data): Model
    {
        $attrs = $data->toArray();
        if (array_key_exists('answer', $attrs)) {
            $attrs['answer'] = HtmlSanitizer::clean($attrs['answer']);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Faq $model): bool
    {
        return $this->repository->delete($model);
    }
}
