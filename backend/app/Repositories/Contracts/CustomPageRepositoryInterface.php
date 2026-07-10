<?php

namespace App\Repositories\Contracts;

interface CustomPageRepositoryInterface extends RepositoryInterface
{
    public function findByPreviewToken(string $token): ?\Illuminate\Database\Eloquent\Model;
}
