import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { SettingsPageShell } from '@/components/settings/SettingsPageShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useDeleteNavigation,
  useNavigation,
  useSaveNavigation,
} from '@/hooks/useContentApi'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

export function NavigationSettingsPage() {
  const { data: items = [], isLoading } = useNavigation()
  const saveMutation = useSaveNavigation()
  const deleteMutation = useDeleteNavigation()
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
    success('Pengaturan disimpan', 'Menu navigasi berhasil diperbarui.')
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    success('Dihapus', 'Menu navigasi berhasil dihapus.')
  }

  const renderForm = (item: ApiRecord, id?: string) => {
    const draft = id ? getDraft(item) : item
    const setField = (patch: Partial<ApiRecord>) => {
      if (id) updateDraft(id, patch)
      else setNewItem((prev) => ({ ...(prev ?? { label: '', url: '/', is_external: false }), ...patch }))
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input value={String(draft.label ?? '')} onChange={(e) => setField({ label: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input value={String(draft.url ?? '')} onChange={(e) => setField({ url: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={Boolean(draft.is_external)}
            onCheckedChange={(checked) => setField({ is_external: checked })}
          />
          <Label>Buka di tab baru (eksternal)</Label>
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
      title="Pengaturan Navigasi"
      description="Menu navbar website publik"
      breadcrumbLabel="Navigasi"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={String(item.id)} className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>{String(getDraft(item).label ?? item.label)}</CardTitle>
              <CardDescription>{String(getDraft(item).url ?? item.url)}</CardDescription>
            </CardHeader>
            <CardContent>{renderForm(item, String(item.id))}</CardContent>
          </Card>
        ))}

        {newItem ? (
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Menu Baru</CardTitle>
            </CardHeader>
            <CardContent>{renderForm(newItem)}</CardContent>
          </Card>
        ) : (
          <Button type="button" variant="outline" onClick={() => setNewItem({ label: '', url: '/', is_external: false })}>
            <Plus className="h-4 w-4" />
            Tambah Menu
          </Button>
        )}
      </div>
    </SettingsPageShell>
  )
}
