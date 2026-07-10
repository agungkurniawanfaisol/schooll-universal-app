import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Search, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useNotificationStore } from '@/stores/notificationStore'
import { ppdbSubmitSchema, type PpdbSubmitFormData } from '@/validators/cms'
import type { ApiResponse } from '@/types/api'

const statusLabels: Record<string, string> = {
  pending: 'Menunggu Verifikasi',
  approved: 'Diterima',
  rejected: 'Ditolak',
}

export function PpdbPublicPage() {
  const { success, error } = useNotificationStore()
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [statusResult, setStatusResult] = useState<Record<string, unknown> | null>(null)

  const form = useForm<PpdbSubmitFormData>({
    resolver: zodResolver(ppdbSubmitSchema),
    defaultValues: {
      studentName: '',
      parentName: '',
      parentPhone: '',
    },
  })

  const submitMutation = useMutation({
    mutationFn: async (data: PpdbSubmitFormData) => {
      const response = await apiClient.post<ApiResponse<Record<string, unknown>>>(
        endpoints.public.ppdbSubmit,
        {
          student_name: data.studentName,
          birth_date: data.birthDate || undefined,
          gender: data.gender || undefined,
          parent_name: data.parentName,
          parent_phone: data.parentPhone,
          parent_email: data.parentEmail || undefined,
          address: data.address || undefined,
          previous_school: data.previousSchool || undefined,
        },
      )
      return response.data.data
    },
    onSuccess: (data) => {
      success(
        'Pendaftaran berhasil',
        `Nomor pendaftaran: ${String(data?.registration_number ?? '')}`,
      )
      form.reset()
    },
    onError: () => error('Gagal', 'Tidak dapat mengirim pendaftaran'),
  })

  const checkStatus = async () => {
    if (!registrationNumber.trim()) return
    try {
      const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
        endpoints.public.ppdbStatus(registrationNumber.trim()),
      )
      setStatusResult(response.data.data ?? null)
    } catch {
      setStatusResult(null)
      error('Tidak ditemukan', 'Nomor pendaftaran tidak valid')
    }
  }

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="PPDB" description="Penerimaan Peserta Didik Baru">
      <div className="mx-auto max-w-2xl space-y-8">
        <PublicPageHeader
          eyebrow="PPDB"
          title="Pendaftaran Siswa Baru"
          description="Isi formulir pendaftaran atau cek status pendaftaran Anda."
        />

        <Tabs defaultValue="daftar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daftar">Daftar</TabsTrigger>
            <TabsTrigger value="status">Cek Status</TabsTrigger>
          </TabsList>

          <TabsContent value="daftar">
            <Card className="border-none shadow-soft">
              <CardContent className="p-6">
                <form
                  onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Nama Siswa</Label>
                    <Input id="studentName" {...form.register('studentName')} />
                    {form.formState.errors.studentName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.studentName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Tanggal Lahir</Label>
                      <Input id="birthDate" type="date" {...form.register('birthDate')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin</Label>
                      <Input id="gender" placeholder="L/P" {...form.register('gender')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nama Orang Tua</Label>
                    <Input id="parentName" {...form.register('parentName')} />
                    {form.formState.errors.parentName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.parentName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Telepon</Label>
                      <Input id="parentPhone" {...form.register('parentPhone')} />
                      {form.formState.errors.parentPhone && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.parentPhone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">Email</Label>
                      <Input id="parentEmail" type="email" {...form.register('parentEmail')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea id="address" rows={2} {...form.register('address')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousSchool">Asal Sekolah</Label>
                    <Input id="previousSchool" {...form.register('previousSchool')} />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? 'Mengirim...' : 'Kirim Pendaftaran'}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <Card className="border-none shadow-soft">
              <CardContent className="space-y-4 p-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nomor pendaftaran"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                  <Button variant="gradient" onClick={() => void checkStatus()}>
                    <Search className="h-4 w-4" />
                    Cek
                  </Button>
                </div>
                {statusResult ? (
                  <div className="rounded-xl border border-border p-4 text-sm">
                    <p>
                      <span className="text-muted-foreground">Nama:</span>{' '}
                      {String(statusResult.student_name)}
                    </p>
                    <p className="mt-2">
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <Badge>
                        {statusLabels[String(statusResult.status)] ?? String(statusResult.status)}
                      </Badge>
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PublicPageShell>
  )
}
