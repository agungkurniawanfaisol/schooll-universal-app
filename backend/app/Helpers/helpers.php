<?php

use Illuminate\Support\Str;

if (! function_exists('generate_unique_slug')) {
    function generate_unique_slug(string $modelClass, string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while ($modelClass::query()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}

if (! function_exists('media_url')) {
    function media_url(?string $path, string $disk = 'public'): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
    }
}

if (! function_exists('cms_permissions')) {
    function cms_permissions(): array
    {
        $modules = [
            'dashboard',
            'users',
            'roles',
            'permissions',
            'media',
            'teachers',
            'activities',
            'agendas',
            'galleries',
            'testimonials',
            'facilities',
            'achievements',
            'news',
            'content',
            'settings',
            'seo',
            'contact',
            'pages',
            'ppdb',
            'academic_events',
            'downloads',
            'faqs',
            'extracurriculars',
            'newsletter',
            'audit',
            'analytics',
            'webhooks',
            'tenants',
            'backup',
            'api_tokens',
        ];

        $actions = ['view', 'create', 'update', 'delete'];

        $permissions = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                if ($module === 'dashboard' && $action !== 'view') {
                    continue;
                }
                if ($module === 'permissions' && in_array($action, ['create', 'update', 'delete'], true)) {
                    continue;
                }
                if (in_array($module, ['audit', 'analytics', 'backup'], true) && $action !== 'view') {
                    continue;
                }
                $permissions[] = "{$module}.{$action}";
            }
        }

        return $permissions;
    }
}
