import { create } from "zustand";

type Store = {
  content: string;
  setContent: (v: string) => void;

  status: "idle" | "saving" | "saved";
  setStatus: (v: "idle" | "saving" | "saved") => void;

  lastSaved: string;
  setLastSaved: (v: string) => void;

  documentId: string | null;
  setDocumentId: (id: string | null) => void;
};

const useEditorStore = create<Store>((set) => ({
  content: "",
  setContent: (content) => set({ content }),

  status: "idle",
  setStatus: (status) => set({ status }),

  lastSaved: "",
  setLastSaved: (lastSaved) => set({ lastSaved }),

  documentId: null,
  setDocumentId: (documentId) => set({ documentId }),
}));

export default useEditorStore;
