<?php

use App\Rules\SafeMediaUrl;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    config(['app.url' => 'http://localhost']);
    Storage::fake('public');
});

it('allows relative storage media paths', function () {
    expect(SafeMediaUrl::isAllowed('/storage/media/2026/07/abc.jpg'))->toBeTrue();
});

it('allows absolute url when host matches app url', function () {
    $url = 'http://localhost/storage/media/2026/07/abc.jpg';

    expect(SafeMediaUrl::isAllowed($url))->toBeTrue();
});

it('rejects external urls', function () {
    expect(SafeMediaUrl::isAllowed('https://evil.com/storage/media/2026/07/abc.jpg'))->toBeFalse();
});

it('rejects javascript urls', function () {
    expect(SafeMediaUrl::isAllowed('javascript:alert(1)'))->toBeFalse();
});

it('rejects non media paths', function () {
    expect(SafeMediaUrl::isAllowed('https://localhost/other/path.jpg'))->toBeFalse();
});

it('rejects empty string', function () {
    expect(SafeMediaUrl::isAllowed(''))->toBeFalse();
});
