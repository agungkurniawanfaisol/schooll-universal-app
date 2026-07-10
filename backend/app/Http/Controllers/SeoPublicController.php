<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Agenda;
use App\Models\Gallery;
use App\Models\News;
use App\Models\Teacher;
use App\Services\SeoService;
use App\Services\SettingService;
use Illuminate\Http\Response;

class SeoPublicController extends Controller
{
    public function __construct(
        private SeoService $seoService,
        private SettingService $settingService,
    ) {}

    public function robots(): Response
    {
        $appUrl = rtrim(config('app.url'), '/');
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /dashboard',
            'Disallow: /login',
            'Disallow: /api/',
            '',
            "Sitemap: {$appUrl}/sitemap.xml",
        ]);

        return response($content, 200, ['Content-Type' => 'text/plain']);
    }

    public function sitemap(): Response
    {
        $appUrl = rtrim(config('app.url'), '/');
        $urls = [
            ['loc' => $appUrl.'/', 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => $appUrl.'/berita', 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => $appUrl.'/agenda', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => $appUrl.'/guru', 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => $appUrl.'/galeri', 'changefreq' => 'weekly', 'priority' => '0.7'],
        ];

        News::query()
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get(['slug', 'updated_at'])
            ->each(function (News $news) use (&$urls, $appUrl): void {
                $urls[] = [
                    'loc' => $appUrl.'/berita/'.$news->slug,
                    'lastmod' => optional($news->updated_at)->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            });

        Agenda::query()
            ->where('status', 'published')
            ->get(['slug', 'updated_at'])
            ->each(function (Agenda $agenda) use (&$urls, $appUrl): void {
                $urls[] = [
                    'loc' => $appUrl.'/agenda/'.$agenda->slug,
                    'lastmod' => optional($agenda->updated_at)->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.6',
                ];
            });

        Teacher::query()
            ->where('status', 'published')
            ->get(['slug', 'updated_at'])
            ->each(function (Teacher $teacher) use (&$urls, $appUrl): void {
                $urls[] = [
                    'loc' => $appUrl.'/guru/'.$teacher->slug,
                    'lastmod' => optional($teacher->updated_at)->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            });

        Gallery::query()
            ->where('status', 'published')
            ->get(['slug', 'updated_at'])
            ->each(function (Gallery $gallery) use (&$urls, $appUrl): void {
                $urls[] = [
                    'loc' => $appUrl.'/galeri/'.$gallery->slug,
                    'lastmod' => optional($gallery->updated_at)->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            });

        Activity::query()
            ->where('status', 'published')
            ->get(['slug', 'updated_at'])
            ->each(function (Activity $activity) use (&$urls, $appUrl): void {
                $urls[] = [
                    'loc' => $appUrl.'/kegiatan/'.$activity->slug,
                    'lastmod' => optional($activity->updated_at)->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.5',
                ];
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($url['loc']).'</loc>';
            if (! empty($url['lastmod'])) {
                $xml .= '<lastmod>'.$url['lastmod'].'</lastmod>';
            }
            $xml .= '<changefreq>'.($url['changefreq'] ?? 'monthly').'</changefreq>';
            $xml .= '<priority>'.($url['priority'] ?? '0.5').'</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
