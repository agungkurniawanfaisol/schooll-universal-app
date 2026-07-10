<?php

namespace Tests\Support;

use Illuminate\Http\UploadedFile;

trait CreatesUploadFixtures
{
    protected function jpegFixture(string $name = 'test.jpg'): UploadedFile
    {
        $tmp = tempnam(sys_get_temp_dir(), 'jpeg');
        copy(base_path('tests/fixtures/minimal.jpg'), $tmp);

        return new UploadedFile($tmp, $name, 'image/jpeg', null, true);
    }

    protected function pngFixture(string $name = 'test.png'): UploadedFile
    {
        $tmp = tempnam(sys_get_temp_dir(), 'png');
        copy(base_path('tests/fixtures/minimal.png'), $tmp);

        return new UploadedFile($tmp, $name, 'image/png', null, true);
    }
}
