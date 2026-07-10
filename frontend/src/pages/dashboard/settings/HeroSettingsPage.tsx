import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { ImageUploader } from '@/components/common/ImageUploader'
import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { UPLOAD_ACCEPT, UPLOAD_MAX_SIZE_MB } from '@/config/upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useDeleteHeroSection,
  useHeroSections,
  useSaveHeroSection,
} from '@/hooks/useContentApi'
import { uploadMediaFile } from '@/hooks/useMediaUpload'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

const emptySlide = (): ApiRecord => ({
  title: '',
  subtitle: '',
  description: '',
  background_image: '',
  cta_text: 'Pelajari Lebih Lanjut',
  cta_url: '#tentang',
  status: 'published',
  sort_order: 0,
})

export function HeroSettingsPage() {
  const { data: slides = [], isLoading } = useHeroSections()
  const saveMutation = useSaveHeroSection()
  const deleteMutation = useDeleteHeroSection()
  const { success } = useNotificationStore()
  const [drafts, setDrafts] = useState<Record<string, ApiRecord>>({})
  const [newSlide, setNewSlide] = useState<ApiRecord | null>(null)

  const getDraft = (slide: ApiRecord) => {
    const id = String(slide.id)
    return drafts[id] ?? slide
  }

  const updateDraft = (id: string, patch: Partial<ApiRecord>) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft({ id, ...slides.find((s) => String(s.id) === id) }), ...patch },
    }))
  }

  const handleSave = async (slide: ApiRecord) => {
    const id = slide.id ? String(slide.id) : undefined
    const data = id ? getDraft(slide) : slide
    await saveMutation.mutateAsync({ id, data })
    if (id) {
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } else {
      setNewSlide(null)
    }
    success('Pengaturan disimpan', 'Slide hero berhasil diperbarui.')
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    success('Dihapus', 'Slide hero berhasil dihapus.')
  }

  const renderForm = (slide: ApiRecord, id?: string) => {
    const draft = id ? getDraft(slide) : slide
    const setField = (patch: Partial<ApiRecord>) => {
      if (id) updateDraft(id, patch)
      else setNewSlide((prev) => ({ ...(prev ?? emptySlide()), ...patch }))
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Judul</Label>
          <Input value={String(draft.title ?? '')} onChange={(e) => setField({ title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Subjudul</Label>
          <Input value={String(draft.subtitle ?? '')} onChange={(e) => setField({ subtitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea
            rows={4}
            value={String(draft.description ?? '')}
            onChange={(e) => setField({ description: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Teks CTA</Label>
            <Input value={String(draft.cta_text ?? '')} onChange={(e) => setField({ cta_text: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>URL CTA</Label>
            <Input value={String(draft.cta_url ?? '')} onChange={(e) => setField({ cta_url: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Gambar Latar</Label>
          <ImageUploader
            value={String(draft.background_image ?? '')}
            onChange={(url) => setField({ background_image: url })}
            onUpload={uploadMediaFile}
            accept={UPLOAD_ACCEPT}
            maxSizeMB={UPLOAD_MAX_SIZE_MB}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="gradient" disabled={saveMutation.isPending} onClick={() => handleSave(draft)}>
            Simpan Slide
          </Button>
          {id ? (
            <Button type="button" variant="outline" disabled={deleteMutation.isPending} onClick={() => handleDelete(id)}>
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setNewSlide(null)}>
              Batal
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <SettingsPageShell
      title="Pengaturan Hero"
      description="Kelola slide carousel banner utama"
      breadcrumbLabel="Hero Section"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={String(slide.id)} className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Slide {index + 1}</CardTitle>
              <CardDescription>{String(getDraft(slide).title ?? slide.title)}</CardDescription>
            </CardHeader>
            <CardContent>{renderForm(slide, String(slide.id))}</CardContent>
          </Card>
        ))}

        {newSlide ? (
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Slide Baru</CardTitle>
            </CardHeader>
            <CardContent>{renderForm(newSlide)}</CardContent>
          </Card>
        ) : (
          <Button type="button" variant="outline" onClick={() => setNewSlide(emptySlide())}>
            <Plus className="h-4 w-4" />
            Tambah Slide
          </Button>
        )}
      </div>
    </SettingsPageShell>
  )
}
