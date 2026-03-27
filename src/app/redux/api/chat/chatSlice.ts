import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  activeConversationId: string | null;
  typing: boolean;
  adminConversationIds: string[]; 
}

const initialState: ChatState = {
  activeConversationId: null,
  typing: false,
  adminConversationIds: [], 
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.typing = action.payload;
    },
    // ✅ Called after createAdminConversation succeeds
    addAdminConversationId(state, action: PayloadAction<string>) {
      if (!state.adminConversationIds.includes(action.payload)) {
        state.adminConversationIds.push(action.payload);
      }
    },
  },
});

export const { setActiveConversation, setTyping, addAdminConversationId } =
  chatSlice.actions;
export default chatSlice.reducer;
