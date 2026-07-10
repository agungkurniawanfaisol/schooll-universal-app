<?php

namespace App\Support;

class HtmlSanitizer
{
    /** @var list<string> */
    private const ALLOWED_TAGS = [
        'p', 'br', 'strong', 'em', 'u', 'b', 'i',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'span', 'div',
    ];

    public static function clean(?string $html): ?string
    {
        if ($html === null || $html === '') {
            return $html;
        }

        $cleaned = preg_replace('/<(script|style)\b[^>]*>.*?<\/\1>/is', '', $html) ?? '';
        $allowed = '<'.implode('><', self::ALLOWED_TAGS).'>';
        $cleaned = strip_tags($cleaned, $allowed);
        $cleaned = preg_replace('/\s(on\w+|xmlns)\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $cleaned) ?? '';
        $cleaned = preg_replace(
            '/\s(href|src|xlink:href)\s*=\s*("\s*(javascript|data|vbscript):[^"]*"|\'\s*(javascript|data|vbscript):[^\']*\')/i',
            '',
            $cleaned,
        ) ?? '';

        return trim($cleaned);
    }
}
