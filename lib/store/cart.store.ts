import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  slug: string
  image: string
  price: number
  quantity: number
  variantInfo?: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  // Computed
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          if (existingIndex !== -1) {
            // Increase quantity
            const updated = [...state.items]
            const existing = updated[existingIndex]
            const newQty = Math.min(
              existing.quantity + (newItem.quantity ?? 1),
              existing.stock
            )
            updated[existingIndex] = { ...existing, quantity: newQty }
            return { items: updated }
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        }))
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.productId === productId &&
              item.variantId === variantId
            ) {
              return { ...item, quantity: Math.min(quantity, item.stock) }
            }
            return item
          }),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'vellure-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
