import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  title: string
  content: React.ReactNode | null
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  openModal: (options: {
    title?: string
    content: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  size: 'md',
  openModal: ({ title = '', content, size = 'md' }) =>
    set({ isOpen: true, title, content, size }),
  closeModal: () => set({ isOpen: false, title: '', content: null }),
}))
