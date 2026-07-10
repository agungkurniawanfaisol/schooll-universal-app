import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type PermissionGroup = Record<string, { id: number; name: string }[]>

interface PermissionPickerProps {
  groups: PermissionGroup
  value: string[]
  onChange: (permissions: string[]) => void
  className?: string
}

function formatModuleLabel(module: string): string {
  return module
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function PermissionPicker({ groups, value, onChange, className }: PermissionPickerProps) {
  const toggle = (name: string, checked: boolean) => {
    if (checked) {
      onChange([...new Set([...value, name])])
      return
    }
    onChange(value.filter((p) => p !== name))
  }

  const toggleModule = (module: string, checked: boolean) => {
    const names = (groups[module] ?? []).map((p) => p.name)
    if (checked) {
      onChange([...new Set([...value, ...names])])
      return
    }
    onChange(value.filter((p) => !names.includes(p)))
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(groups).map(([module, permissions]) => {
        const names = permissions.map((p) => p.name)
        const allSelected = names.length > 0 && names.every((n) => value.includes(n))
        const someSelected = names.some((n) => value.includes(n))

        return (
          <div key={module} className="rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Checkbox
                id={`module-${module}`}
                checked={allSelected}
                onCheckedChange={(checked) => toggleModule(module, checked === true)}
                className={someSelected && !allSelected ? 'opacity-70' : undefined}
              />
              <Label htmlFor={`module-${module}`} className="font-semibold">
                {formatModuleLabel(module)}
              </Label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {permissions.map((permission) => (
                <label
                  key={permission.name}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/60"
                >
                  <Checkbox
                    checked={value.includes(permission.name)}
                    onCheckedChange={(checked) => toggle(permission.name, checked === true)}
                  />
                  <span className="text-muted-foreground">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
