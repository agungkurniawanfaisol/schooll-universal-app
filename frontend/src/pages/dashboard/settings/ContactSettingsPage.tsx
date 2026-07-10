import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useContactInfo,
  useDeleteContactInfo,
  useSaveContactInfo,
} from '@/hooks/useContentApi'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

export function ContactSettingsPage() {
  const { data: items = [], isLoading } = useContactInfo()
  const saveMutation = useSaveContactInfo()
  const deleteMutation = useDeleteContactInfo()
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
    success('Pengaturan disimpan', 'Informasi kontak berhasil diperbarui.')
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    success('Dihapus', 'Informasi kontak berhasil dihapus.')
  }

  const renderForm = (item: ApiRecord, id?: string) => {
    const draft = id ? getDraft(item) : item
    const setField = (patch: Partial<ApiRecord>) => {
      if (id) updateDraft(id, patch)
      else setNewItem((prev) => ({ ...(prev ?? { type: 'phone', label: '', value: '' }), ...patch }))
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Tipe</Label>
          <Input value={String(draft.type ?? '')} onChange={(e) => setField({ type: e.target.value })} placeholder="address, phone, email" />
        </div>
        <div className="space-y-2">
          <Label>Label</Label>
          <Input value={String(draft.label ?? '')} onChange={(e) => setField({ label: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Nilai</Label>
          <Input value={String(draft.value ?? '')} onChange={(e) => setField({ value: e.target.value })} />
        </div>
        <div className="flex gap-2 sm:col-span-2">
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
      title="Pengaturan Kontak"
      description="Alamat, telepon, email, dan informasi kontak lainnya"
      breadcrumbLabel="Kontak"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={String(item.id)} className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>{String(getDraft(item).label ?? item.label ?? item.type)}</CardTitle>
              <CardDescription>{String(getDraft(item).value ?? item.value)}</CardDescription>
            </CardHeader>
            <CardContent>{renderForm(item, String(item.id))}</CardContent>
          </Card>
        ))}

        {newItem ? (
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Kontak Baru</CardTitle>
            </CardHeader>
            <CardContent>{renderForm(newItem)}</CardContent>
          </Card>
        ) : (
          <Button type="button" variant="outline" onClick={() => setNewItem({ type: 'phone', label: '', value: '' })}>
            <Plus className="h-4 w-4" />
            Tambah Kontak
          </Button>
        )}
      </div>
    </SettingsPageShell>
  )
}
