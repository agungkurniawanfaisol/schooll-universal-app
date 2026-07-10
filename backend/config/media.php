<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Upload limits
    |--------------------------------------------------------------------------
    */

    'max_upload_kb' => (int) env('MEDIA_MAX_UPLOAD_KB', 5120),

    'allowed_mimes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
    ],

    'allowed_extensions' => [
        'jpg',
        'jpeg',
        'png',
        'webp',
    ],

    'max_width' => (int) env('MEDIA_MAX_WIDTH', 4096),

    'max_height' => (int) env('MEDIA_MAX_HEIGHT', 4096),

    'output_max_width' => (int) env('MEDIA_OUTPUT_MAX_WIDTH', 1920),

    'output_quality' => (int) env('MEDIA_OUTPUT_QUALITY', 85),

    'max_album_images' => (int) env('MEDIA_MAX_ALBUM_IMAGES', 20),

];
