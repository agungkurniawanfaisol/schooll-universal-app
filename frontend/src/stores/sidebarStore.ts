import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  expandedGroups: string[]
  toggle: () => void
  setOpen: (open: boolean) => void
  toggleCollapsed: () => void
  toggleGroup: (groupId: string) => void
  setExpandedGroups: (groupIds: string[]) => void
  ensureExpanded: (groupIds: string[]) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isCollapsed: false,
      expandedGroups: ['content', 'settings'],
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleGroup: (groupId) =>
        set((state) => ({
          expandedGroups: state.expandedGroups.includes(groupId)
            ? state.expandedGroups.filter((id) => id !== groupId)
            : [...state.expandedGroups, groupId],
        })),
      setExpandedGroups: (expandedGroups) => set({ expandedGroups }),
      ensureExpanded: (groupIds) => {
        const merged = new Set([...get().expandedGroups, ...groupIds])
        set({ expandedGroups: Array.from(merged) })
      },
    }),
    { name: 'sekolah-sidebar' },
  ),
)
