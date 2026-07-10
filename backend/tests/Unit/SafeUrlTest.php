<?php

use App\Rules\SafeUrl;

it('allows https urls', function () {
    expect(SafeUrl::isSafe('https://example.com/path'))->toBeTrue();
});

it('allows relative paths', function () {
    expect(SafeUrl::isSafe('/images/logo.png'))->toBeTrue();
});

it('allows empty string', function () {
    expect(SafeUrl::isSafe(''))->toBeTrue();
});

it('rejects javascript urls', function () {
    expect(SafeUrl::isSafe('javascript:alert(1)'))->toBeFalse();
});

it('rejects data urls', function () {
    expect(SafeUrl::isSafe('data:text/html,<script>alert(1)</script>'))->toBeFalse();
});

it('rejects vbscript urls', function () {
    expect(SafeUrl::isSafe('vbscript:msgbox(1)'))->toBeFalse();
});
