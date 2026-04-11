import { create } from "zustand";

type BookingState = {
  yachtSlug?: string;
  date?: string;
  guests: number;
  hours: number;
  setDraft: (draft: Partial<BookingState>) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  guests: 1,
  hours: 2,
  setDraft: (draft) => set((state) => ({ ...state, ...draft })),
}));
