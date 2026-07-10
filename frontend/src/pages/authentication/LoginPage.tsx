import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SEOHead } from '@/components/common/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useSchoolName } from '@/hooks/useSchoolName'
import { loginSchema, type LoginFormData } from '@/validators/auth'

export function LoginPage() {
  const { login } = useAuth()
  const schoolName = useSchoolName()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@sekolah.test', password: 'password' },
  })

  return (
    <>
      <SEOHead title="Login" noIndex />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/90 shadow-glow backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
            <CardDescription>Masuk ke panel administrasi {schoolName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sekolah.test"
                    className="pl-9"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
