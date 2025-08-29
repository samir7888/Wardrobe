import { create } from "zustand";
import { Item, OutfitSelection, ClothingCategory } from "@/types";

interface OutfitState {
  // Current outfit selection (temporary)
  currentSelection: OutfitSelection;

  // Today's confirmed outfit
  todaysOutfit: OutfitSelection | null;

  // Available items grouped by category
  availableItems: {
    top: Item[];
    bottom: Item[];
    shoes: Item[];
    accessories: Item[];
  };

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  selectItem: (category: ClothingCategory, item: Item) => void;
  deselectItem: (category: ClothingCategory) => void;
  confirmTodaysOutfit: () => void;
  resetTodaysOutfit: () => void;
  resetCurrentSelection: () => void;
  setAvailableItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  currentSelection: {},
  todaysOutfit: null,
  availableItems: {
    top: [],
    bottom: [],
    shoes: [],
    accessories: [],
  },
  isLoading: false,
  error: null,

  selectItem: (category: ClothingCategory, item: Item) => {
    set((state) => ({
      currentSelection: {
        ...state.currentSelection,
        [category]: item,
      },
    }));
  },

  deselectItem: (category: ClothingCategory) => {
    set((state) => {
      const newSelection = { ...state.currentSelection };
      delete newSelection[category];
      return {
        currentSelection: newSelection,
      };
    });
  },

  confirmTodaysOutfit: () => {
    const { currentSelection } = get();
    set({
      todaysOutfit: { ...currentSelection },
    });
  },

  resetTodaysOutfit: () => {
    set({
      todaysOutfit: null,
    });
  },

  resetCurrentSelection: () => {
    set({
      currentSelection: {},
    });
  },

  setAvailableItems: (items: Item[]) => {
    const groupedItems = {
      top: items.filter((item) => {
        const category = item.category.toLowerCase();
        return (
          category === "top" ||
          category === "tops" ||
          category === "shirt" ||
          category === "blouse"
        );
      }),
      bottom: items.filter((item) => {
        const category = item.category.toLowerCase();
        return (
          category === "bottom" ||
          category === "bottoms" ||
          category === "pants" ||
          category === "jeans" ||
          category === "shorts"
        );
      }),
      shoes: items.filter((item) => {
        const category = item.category.toLowerCase();
        return (
          category === "shoes" || category === "shoe" || category === "footwear"
        );
      }),
      accessories: items.filter((item) => {
        const category = item.category.toLowerCase();
        return (
          category === "accessories" ||
          category === "accessory" ||
          category === "belt" ||
          category === "watch" ||
          category === "jewelry"
        );
      }),
    };

    set({
      availableItems: groupedItems,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
