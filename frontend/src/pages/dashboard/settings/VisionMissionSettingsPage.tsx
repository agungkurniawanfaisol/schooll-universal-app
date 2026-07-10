import { Plus } from 'lucide-react'
import { useState } from 'react'

import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSaveVisionMission, useVisionMission } from '@/hooks/useContentApi'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

export function VisionMissionSettingsPage() {
  const { data: items = [], isLoading } = useVisionMission()
  const saveMutation = useSaveVisionMission()
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
    success('Pengaturan disimpan', 'Visi & misi berhasil diperbarui.')
  }

  const renderForm = (item: ApiRecord, id?: string) => {
    const draft = id ? getDraft(item) : item
    const setField = (patch: Partial<ApiRecord>) => {
      if (id) updateDraft(id, patch)
      else setNewItem((prev) => ({ ...(prev ?? { type: 'mission', title: '', content: '' }), ...patch }))
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipe</Label>
            <Select value={String(draft.type ?? 'mission')} onValueChange={(v) => setField({ type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vision">Visi</SelectItem>
                <SelectItem value="mission">Misi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input value={String(draft.title ?? '')} onChange={(e) => setField({ title: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Konten</Label>
          <Textarea rows={4} value={String(draft.content ?? '')} onChange={(e) => setField({ content: e.target.value })} />
        </div>
        <Button type="button" variant="gradient" disabled={saveMutation.isPending} onClick={() => handleSave(draft, id)}>
          Simpan
        </Button>
      </div>
    )
  }

  return (
    <SettingsPageShell
      title="Visi & Misi"
      description="Kelola visi dan misi sekolah"
      breadcrumbLabel="Visi & Misi"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={String(item.id)} className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>{String(getDraft(item).type === 'vision' ? 'Visi' : 'Misi')}</CardTitle>
              <CardDescription>{String(getDraft(item).title ?? item.title)}</CardDescription>
            </CardHeader>
            <CardContent>{renderForm(item, String(item.id))}</CardContent>
          </Card>
        ))}

        {newItem ? (
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Item Baru</CardTitle>
            </CardHeader>
            <CardContent>{renderForm(newItem)}</CardContent>
          </Card>
        ) : (
          <Button type="button" variant="outline" onClick={() => setNewItem({ type: 'mission', title: '', content: '' })}>
            <Plus className="h-4 w-4" />
            Tambah Misi
          </Button>
        )}
      </div>
    </SettingsPageShell>
  )
}
