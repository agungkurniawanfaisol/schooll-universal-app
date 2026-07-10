<?php

namespace Database\Seeders;

use App\Enums\PublishStatus;
use App\Models\AboutSchool;
use App\Models\Achievement;
use App\Models\Activity;
use App\Models\Agenda;
use App\Models\ContactInfo;
use App\Models\Facility;
use App\Models\FooterSetting;
use App\Models\Gallery;
use App\Models\HeroSection;
use App\Models\NavigationMenu;
use App\Models\News;
use App\Models\PrincipalMessage;
use App\Models\SeoSetting;
use App\Models\SocialMedia;
use App\Models\Teacher;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\VisionMission;
use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CmsContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@sekolah.test'],
            [
                'name' => 'Administrator Sekolah',
                'password' => Hash::make('password'),
                'status' => 'active',
            ],
        );
        $admin->assignRole('Super Admin');

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'school_name'],
            ['value' => ['text' => 'SMP Negeri 1 Harapan Bangsa'], 'group' => 'general'],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'school_tagline'],
            ['value' => ['text' => 'Unggul dalam Prestasi, Berakhlak Mulia'], 'group' => 'general'],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'school_logo'],
            ['value' => ['url' => null], 'group' => 'general'],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'ppdb_url'],
            ['value' => ['url' => '/berita/penerimaan-peserta-didik-baru-2026'], 'group' => 'general'],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'splash_screen_enabled'],
            ['value' => ['enabled' => true], 'group' => 'general'],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'hero_stats'],
            [
                'value' => [
                    ['label' => 'Siswa Aktif', 'value' => 900, 'suffix' => '+'],
                    ['label' => 'Guru Profesional', 'value' => 40, 'suffix' => '+'],
                    ['label' => 'Prestasi Nasional', 'value' => 20, 'suffix' => '+'],
                    ['label' => 'Tingkat Kelulusan', 'value' => 98, 'suffix' => '%'],
                ],
                'group' => 'hero',
            ],
        );

        WebsiteSetting::query()->updateOrCreate(
            ['key' => 'ppdb_url'],
            ['value' => ['url' => '/#berita'], 'group' => 'general'],
        );

        HeroSection::query()->updateOrCreate(
            ['title' => 'Selamat Datang di SMP Negeri 1 Harapan Bangsa'],
            [
                'subtitle' => 'Membangun Generasi Cerdas dan Berkarakter',
                'description' => 'Kami berkomitmen memberikan pendidikan berkualitas dengan lingkungan belajar yang kondusif, guru profesional, dan fasilitas modern.',
                'background_image' => null,
                'cta_text' => 'Pelajari Lebih Lanjut',
                'cta_url' => '#tentang',
                'status' => PublishStatus::Published->value,
                'sort_order' => 1,
            ],
        );

        HeroSection::query()->updateOrCreate(
            ['title' => 'Prestasi dan Inovasi untuk Masa Depan'],
            [
                'subtitle' => 'Mencetak Generasi Unggul & Berwawasan Global',
                'description' => 'Dengan kurikulum inovatif, ekstrakurikuler beragam, dan prestasi nasional, kami mempersiapkan siswa menghadapi tantangan masa depan.',
                'background_image' => null,
                'cta_text' => 'Lihat Prestasi',
                'cta_url' => '#prestasi',
                'status' => PublishStatus::Published->value,
                'sort_order' => 2,
            ],
        );

        AboutSchool::query()->updateOrCreate(
            ['title' => 'Tentang SMP Negeri 1 Harapan Bangsa'],
            [
                'content' => '<p>SMP Negeri 1 Harapan Bangsa didirikan pada tahun 1985 dan telah menjadi salah satu sekolah menengah pertama terdepan di wilayah ini. Dengan lebih dari 900 siswa aktif, kami fokus pada pengembangan akademik, karakter, dan kreativitas siswa.</p><p>Visi kami adalah mencetak generasi muda yang unggul, mandiri, dan siap menghadapi tantangan global.</p>',
                'image' => null,
                'video_url' => null,
                'status' => PublishStatus::Published->value,
            ],
        );

        VisionMission::query()->updateOrCreate(
            ['type' => 'vision', 'title' => 'Visi'],
            [
                'content' => 'Terwujudnya peserta didik yang beriman, bertakwa, berprestasi, dan berwawasan global.',
                'icon' => 'eye',
                'sort_order' => 1,
                'status' => PublishStatus::Published->value,
            ],
        );

        VisionMission::query()->updateOrCreate(
            ['type' => 'mission', 'title' => 'Misi 1'],
            [
                'content' => 'Menyelenggarakan pembelajaran aktif, inovatif, dan berbasis teknologi.',
                'icon' => 'target',
                'sort_order' => 2,
                'status' => PublishStatus::Published->value,
            ],
        );

        VisionMission::query()->updateOrCreate(
            ['type' => 'mission', 'title' => 'Misi 2'],
            [
                'content' => 'Membina karakter siswa melalui kegiatan religius, sosial, dan kepemimpinan.',
                'icon' => 'heart',
                'sort_order' => 3,
                'status' => PublishStatus::Published->value,
            ],
        );

        PrincipalMessage::query()->updateOrCreate(
            ['name' => 'Drs. Bambang Sutrisno, M.Pd'],
            [
                'title' => 'Kepala Sekolah',
                'photo' => null,
                'message' => 'Assalamualaikum warahmatullahi wabarakatuh. Pendidikan adalah investasi terbaik untuk masa depan bangsa. Di SMP Negeri 1 Harapan Bangsa, kami mengajak seluruh civitas akademika untuk terus belajar, berinovasi, dan berkolaborasi demi kemajuan siswa.',
                'status' => PublishStatus::Published->value,
            ],
        );

        $teachers = [
            ['name' => 'Siti Rahmawati, S.Pd', 'position' => 'Guru Matematika', 'subject' => 'Matematika'],
            ['name' => 'Ahmad Fauzi, S.Pd', 'position' => 'Guru Bahasa Indonesia', 'subject' => 'Bahasa Indonesia'],
            ['name' => 'Dewi Lestari, S.Pd', 'position' => 'Guru IPA', 'subject' => 'Ilmu Pengetahuan Alam'],
            ['name' => 'Rudi Hartono, S.Pd', 'position' => 'Guru Olahraga', 'subject' => 'Pendidikan Jasmani'],
        ];

        foreach ($teachers as $index => $teacher) {
            Teacher::query()->updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($teacher['name'])],
                [
                    'name' => $teacher['name'],
                    'position' => $teacher['position'],
                    'subject' => $teacher['subject'],
                    'biography' => 'Pengajar berpengalaman yang berdedikasi untuk kemajuan siswa.',
                    'social_media' => ['email' => strtolower(str_replace(' ', '.', $teacher['name'])).'@sekolah.test'],
                    'sort_order' => $index + 1,
                    'status' => PublishStatus::Published->value,
                ],
            );
        }

        Activity::query()->updateOrCreate(
            ['slug' => 'study-tour-jakarta'],
            [
                'title' => 'Study Tour ke Museum Nasional',
                'description' => 'Kegiatan pembelajaran luar kelas untuk mengenal sejarah dan budaya Indonesia.',
                'date' => now()->subDays(14)->toDateString(),
                'sort_order' => 1,
                'status' => PublishStatus::Published->value,
            ],
        );

        Activity::query()->updateOrCreate(
            ['slug' => 'lomba-cerdas-cermat'],
            [
                'title' => 'Lomba Cerdas Cermat Antar Kelas',
                'description' => 'Kompetisi akademik tahunan untuk meningkatkan semangat belajar siswa.',
                'date' => now()->subDays(7)->toDateString(),
                'sort_order' => 2,
                'status' => PublishStatus::Published->value,
            ],
        );

        Agenda::query()->updateOrCreate(
            ['slug' => 'rapat-komite-sekolah'],
            [
                'title' => 'Rapat Komite Sekolah',
                'date' => now()->addDays(5)->toDateString(),
                'time' => '09:00:00',
                'location' => 'Ruang Rapat Sekolah',
                'description' => 'Pembahasan program semester genap dan evaluasi kegiatan sekolah.',
                'status' => PublishStatus::Published->value,
            ],
        );

        Agenda::query()->updateOrCreate(
            ['slug' => 'ujian-akhir-semester'],
            [
                'title' => 'Ujian Akhir Semester',
                'date' => now()->addDays(20)->toDateString(),
                'time' => '07:30:00',
                'location' => 'Seluruh Ruang Kelas',
                'description' => 'Pelaksanaan ujian akhir semester genap tahun ajaran 2025/2026.',
                'status' => PublishStatus::Published->value,
            ],
        );

        Gallery::query()->updateOrCreate(
            ['slug' => 'kegiatan-pramuka'],
            [
                'title' => 'Kegiatan Pramuka',
                'description' => 'Dokumentasi kegiatan ekstrakurikuler pramuka.',
                'images' => [],
                'sort_order' => 1,
                'status' => PublishStatus::Published->value,
            ],
        );

        Testimonial::query()->updateOrCreate(
            ['name' => 'Ibu Sari Wulandari'],
            [
                'occupation' => 'Orang Tua Siswa',
                'rating' => 5,
                'comment' => 'Anak saya sangat senang belajar di sekolah ini. Guru-gurunya perhatian dan fasilitasnya memadai.',
                'sort_order' => 1,
                'status' => PublishStatus::Published->value,
            ],
        );

        Testimonial::query()->updateOrCreate(
            ['name' => 'Rizky Pratama'],
            [
                'occupation' => 'Alumni 2024',
                'rating' => 5,
                'comment' => 'Sekolah ini memberikan fondasi yang kuat sehingga saya mudah beradaptasi di SMA.',
                'sort_order' => 2,
                'status' => PublishStatus::Published->value,
            ],
        );

        $facilities = [
            ['title' => 'Perpustakaan Digital', 'slug' => 'perpustakaan-digital'],
            ['title' => 'Laboratorium IPA', 'slug' => 'laboratorium-ipa'],
            ['title' => 'Lapangan Olahraga', 'slug' => 'lapangan-olahraga'],
        ];

        foreach ($facilities as $index => $facility) {
            Facility::query()->updateOrCreate(
                ['slug' => $facility['slug']],
                [
                    'title' => $facility['title'],
                    'description' => 'Fasilitas penunjang kegiatan belajar mengajar yang modern dan nyaman.',
                    'icon' => 'building',
                    'sort_order' => $index + 1,
                    'status' => PublishStatus::Published->value,
                ],
            );
        }

        Achievement::query()->updateOrCreate(
            ['slug' => 'juara-1-olimpiade-matematika'],
            [
                'title' => 'Juara 1 Olimpiade Matematika Tingkat Kota',
                'description' => 'Siswa kami meraih juara pertama dalam kompetisi matematika tingkat kota.',
                'year' => 2025,
                'category' => 'Akademik',
                'sort_order' => 1,
                'status' => PublishStatus::Published->value,
            ],
        );

        News::query()->updateOrCreate(
            ['slug' => 'penerimaan-peserta-didik-baru-2026'],
            [
                'title' => 'Penerimaan Peserta Didik Baru Tahun 2026',
                'excerpt' => 'Informasi lengkap mengenai pendaftaran PPDB SMP Negeri 1 Harapan Bangsa.',
                'content' => '<p>Pendaftaran PPDB dibuka mulai bulan Mei 2026. Silakan unduh formulir dan lengkapi persyaratan di website resmi sekolah.</p>',
                'published_at' => now()->subDays(3),
                'status' => PublishStatus::Published->value,
            ],
        );

        News::query()->updateOrCreate(
            ['slug' => 'workshop-guru-digital'],
            [
                'title' => 'Workshop Guru: Pembelajaran Berbasis Digital',
                'excerpt' => 'Guru mengikuti pelatihan peningkatan kompetensi teknologi pendidikan.',
                'content' => '<p>Workshop diikuti seluruh guru mata pelajaran dengan fokus integrasi teknologi dalam pembelajaran.</p>',
                'published_at' => now()->subDay(),
                'status' => PublishStatus::Published->value,
            ],
        );

        ContactInfo::query()->updateOrCreate(
            ['type' => 'address', 'value' => 'Jl. Pendidikan No. 45, Jakarta Selatan'],
            ['label' => 'Alamat', 'icon' => 'map-pin', 'sort_order' => 1],
        );

        ContactInfo::query()->updateOrCreate(
            ['type' => 'phone', 'value' => '+62 21 1234 5678'],
            ['label' => 'Telepon', 'icon' => 'phone', 'sort_order' => 2],
        );

        ContactInfo::query()->updateOrCreate(
            ['type' => 'email', 'value' => 'info@smpharapanbangsa.sch.id'],
            ['label' => 'Email', 'icon' => 'mail', 'sort_order' => 3],
        );

        SocialMedia::query()->updateOrCreate(
            ['platform' => 'instagram'],
            ['url' => 'https://instagram.com/smpharapanbangsa', 'icon' => 'instagram', 'sort_order' => 1, 'is_active' => true],
        );

        SocialMedia::query()->updateOrCreate(
            ['platform' => 'youtube'],
            ['url' => 'https://youtube.com/@smpharapanbangsa', 'icon' => 'youtube', 'sort_order' => 2, 'is_active' => true],
        );

        SeoSetting::query()->updateOrCreate(
            ['page_key' => 'home'],
            [
                'title' => 'SMP Negeri 1 Harapan Bangsa - Sekolah Unggulan',
                'description' => 'Website resmi SMP Negeri 1 Harapan Bangsa. Informasi sekolah, berita, guru, dan kegiatan.',
                'keywords' => 'smp, sekolah, pendidikan, jakarta',
                'og_title' => 'SMP Negeri 1 Harapan Bangsa',
                'og_description' => 'Sekolah unggulan dengan prestasi akademik dan non-akademik.',
            ],
        );

        $menus = [
            ['label' => 'Beranda', 'url' => '/#hero', 'sort_order' => 1],
            [
                'label' => 'Profil Sekolah',
                'sort_order' => 2,
                'children' => [
                    ['label' => 'Tentang', 'url' => '/#tentang', 'sort_order' => 1],
                    ['label' => 'Visi & Misi', 'url' => '/visi-misi', 'sort_order' => 2],
                    ['label' => 'Kepala Sekolah', 'url' => '/#kepala-sekolah', 'sort_order' => 3],
                ],
            ],
            [
                'label' => 'Akademik',
                'sort_order' => 3,
                'children' => [
                    ['label' => 'Guru', 'url' => '/guru', 'sort_order' => 1],
                    ['label' => 'Kegiatan', 'url' => '/kegiatan', 'sort_order' => 2],
                ],
            ],
            [
                'label' => 'Informasi',
                'sort_order' => 4,
                'children' => [
                    ['label' => 'Agenda', 'url' => '/agenda', 'sort_order' => 1],
                    ['label' => 'Berita', 'url' => '/berita', 'sort_order' => 2],
                    ['label' => 'Galeri', 'url' => '/galeri', 'sort_order' => 3],
                ],
            ],
            [
                'label' => 'Fasilitas & Prestasi',
                'sort_order' => 5,
                'children' => [
                    ['label' => 'Fasilitas', 'url' => '/fasilitas', 'sort_order' => 1],
                    ['label' => 'Prestasi', 'url' => '/prestasi', 'sort_order' => 2],
                    ['label' => 'Testimoni', 'url' => '/testimoni', 'sort_order' => 3],
                ],
            ],
            ['label' => 'Kontak', 'url' => '/#kontak', 'sort_order' => 6],
        ];

        NavigationMenu::query()->delete();

        foreach ($menus as $menu) {
            $children = $menu['children'] ?? null;
            unset($menu['children']);

            $parent = NavigationMenu::query()->create([
                'label' => $menu['label'],
                'url' => $menu['url'] ?? null,
                'sort_order' => $menu['sort_order'],
                'is_external' => false,
            ]);

            if ($children) {
                foreach ($children as $child) {
                    NavigationMenu::query()->create([
                        'label' => $child['label'],
                        'url' => $child['url'],
                        'sort_order' => $child['sort_order'],
                        'is_external' => false,
                        'parent_id' => $parent->id,
                    ]);
                }
            }
        }

        FooterSetting::query()->updateOrCreate(
            ['copyright_text' => '© 2026 SMP Negeri 1 Harapan Bangsa. All rights reserved.'],
            [
                'description' => 'Sekolah unggulan yang menghasilkan generasi cerdas, berkarakter, dan berprestasi.',
                'status' => PublishStatus::Published->value,
            ],
        );
    }
}
