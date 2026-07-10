import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useDeleteSocialMedia,
  useSaveSocialMedia,
  useSocialMedia,
} from '@/hooks/useContentApi'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

export function SocialSettingsPage() {
  const { data: items = [], isLoading } = useSocialMedia()
  const saveMutation = useSaveSocialMedia()
  const deleteMutation = useDeleteSocialMedia()
  const { success } = useNotificationStore()
  const [drafts, setDrafts] = useState<Record<string, ApiRecord>>({})
  const [newItem, setNewItem] = useState<ApiRecord | null>(null)

  const getDraft = (item: ApiRecord) => drafts[String(item.id)] ?? item

  const updateDraft = (id: string, patch: Partial<ApiRecord>) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft({ id, ...items.find((i) => String(i.id) === id) }), ...patch },
    }))
  }

  const handleSave = async (item: ApiRecord, id?: string) => {
    await saveMutation.mutateAsync({ id, data: item })
    if (id) {
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } else {
      setNewItem(null)
    }
    success('Pengaturan disimpan', 'Media sosial berhasil diperbarui.')
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    success('Dihapus', 'Media sosial berhasil dihapus.')
  }

  const renderForm = (item: ApiRecord, id?: string) => {
    const draft = id ? getDraft(item) : item
    const setField = (patch: Partial<ApiRecord>) => {
      if (id) updateDraft(id, patch)
      else setNewItem((prev) => ({ ...(prev ?? { platform: '', url: '', is_active: true }), ...patch }))
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Input value={String(draft.platform ?? '')} onChange={(e) => setField({ platform: e.target.value })} placeholder="instagram, youtube" />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input value={String(draft.url ?? '')} onChange={(e) => setField({ url: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={draft.is_active !== false}
            onCheckedChange={(checked) => setField({ is_active: checked })}
          />
          <Label>Aktif</Label>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="gradient" disabled={saveMutation.isPending} onClick={() => handleSave(draft, id)}>
            Simpan
          </Button>
          {id ? (
            <Button type="button" variant="outline" disabled={deleteMutation.isPending} onClick={() => handleDelete(id)}>
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setNewItem(null)}>
              Batal
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <SettingsPageShell
      title="Media Sosial"
      description="Link profil media sosial sekolah"
      breadcrumbLabel="Media Sosial"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={String(item.id)} className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="capitalize">{String(getDraft(item).platform ?? item.platform)}</CardTitle>
              <CardDescription>{String(getDraft(item).url ?? item.url)}</CardDescription>
            </CardHeader>
            <CardContent>{renderForm(item, String(item.id))}</CardContent>
          </Card>
        ))}

        {newItem ? (
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Media Sosial Baru</CardTitle>
            </CardHeader>
            <CardContent>{renderForm(newItem)}</CardContent>
          </Card>
        ) : (
          <Button type="button" variant="outline" onClick={() => setNewItem({ platform: '', url: '', is_active: true })}>
            <Plus className="h-4 w-4" />
            Tambah Media Sosial
          </Button>
        )}
      </div>
    </SettingsPageShell>
  )
}
