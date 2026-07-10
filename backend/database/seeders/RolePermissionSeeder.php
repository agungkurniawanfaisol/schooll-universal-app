<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (cms_permissions() as $permission) {
            Permission::query()->firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $allPermissions = Permission::query()->pluck('name')->toArray();

        $superAdmin = Role::query()->firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($allPermissions);

        $adminPermissions = array_filter($allPermissions, fn ($p) => ! str_starts_with($p, 'roles.') && ! str_starts_with($p, 'permissions.'));
        $admin = Role::query()->firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions($adminPermissions);

        $editorPermissions = array_filter($allPermissions, fn ($p) => in_array(explode('.', $p)[0], [
            'dashboard', 'media', 'teachers', 'activities', 'agendas', 'galleries',
            'testimonials', 'facilities', 'achievements', 'news', 'content', 'contact',
        ], true) && ! str_ends_with($p, '.delete'));
        $editor = Role::query()->firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);
        $editor->syncPermissions($editorPermissions);
    }
}
