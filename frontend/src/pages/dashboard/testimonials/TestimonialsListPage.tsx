import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapTestimonialListRow, type ListRow } from '@/api/mappers'
import { CmsListPage } from '@/components/common/CmsListPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DataTableColumn } from '@/components/common/DataTable'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiRecord } from '@/api/utils'

interface TestimonialRow extends ListRow {
  moderationStatus: string
}

function mapTestimonialRow(item: ApiRecord): TestimonialRow {
  return {
    ...mapTestimonialListRow(item),
    moderationStatus: String(item.moderation_status ?? 'approved'),
  }
}

function ModerationActions({ id, onDone }: { id: string; onDone: () => void }) {
  const queryClient = useQueryClient()
  const { success, error } = useNotificationStore()

  const mutation = useMutation({
    mutationFn: async (moderationStatus: 'approved' | 'rejected') => {
      await apiClient.patch(endpoints.testimonials.moderation(id), {
        moderation_status: moderationStatus,
        status: moderationStatus === 'approved' ? 'published' : 'draft',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      success('Moderasi diperbarui')
      onDone()
    },
    onError: () => error('Gagal', 'Tidak dapat memperbarui moderasi'),
  })

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        title="Setujui"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate('approved')}
      >
        <Check className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Tolak"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate('rejected')}
      >
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}

export function TestimonialsListPage() {
  const extraColumns: DataTableColumn<TestimonialRow>[] = [
    {
      key: 'moderation_status',
      header: 'Moderasi',
      cardPriority: 2,
      render: (item) => (
        <Badge
          variant={
            item.moderationStatus === 'approved'
              ? 'success'
              : item.moderationStatus === 'pending'
                ? 'default'
                : 'destructive'
          }
        >
          {item.moderationStatus === 'approved'
            ? 'Disetujui'
            : item.moderationStatus === 'pending'
              ? 'Menunggu'
              : 'Ditolak'}
        </Badge>
      ),
    },
    {
      key: 'moderation_actions',
      header: 'Moderasi',
      cardHidden: true,
      render: (item) =>
        item.moderationStatus === 'pending' ? (
          <ModerationActions id={item.id} onDone={() => undefined} />
        ) : null,
    },
  ]

  return (
    <CmsListPage<TestimonialRow>
      title="Kelola Testimoni"
      description="Daftar testimoni alumni dan orang tua"
      breadcrumbLabel="Testimoni"
      basePath="/dashboard/testimonials"
      queryKey="testimonials"
      listUrl={endpoints.testimonials.list}
      bulkDeleteUrl={endpoints.testimonials.bulkDelete}
      deleteUrl={endpoints.testimonials.delete}
      mapper={mapTestimonialRow}
      extraColumns={extraColumns}
    />
  )
}
