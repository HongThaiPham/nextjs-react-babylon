import create from "zustand";

import createPlayerSlice, { IPlayerSlice } from "./createPlayerSlice";
export type AppState = IPlayerSlice;

const useStore = create<AppState>((set, get) => ({
  ...createPlayerSlice(set, get)
}));

export default useStore;
