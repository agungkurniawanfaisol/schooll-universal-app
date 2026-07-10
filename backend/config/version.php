<?php

$path = dirname(base_path()).DIRECTORY_SEPARATOR.'frontend'.DIRECTORY_SEPARATOR.'package.json';

if (! is_file($path)) {
    return [
        'version' => '1.0.0',
        'version_code' => 100,
        'name' => 'Sekolah CMS',
    ];
}

$payload = json_decode((string) file_get_contents($path), true);

return [
    'version' => $payload['version'] ?? '1.0.0',
    'version_code' => $payload['versionCode'] ?? 100,
    'name' => $payload['displayName'] ?? ($payload['name'] ?? 'Sekolah CMS'),
];
