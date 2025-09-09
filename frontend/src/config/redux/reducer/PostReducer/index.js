import { createSlice } from "@reduxjs/toolkit";
import {
  getAllComments,
  getAllPosts,
  incrementPostLikes,
} from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: {},
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(incrementPostLikes.fulfilled, (state, action) => {
        const { post_id, likes } = action.payload;
        const post = state.posts.find((p) => p._id === post_id);
        if (post) {
          post.likes = likes;
        }
      })

      .addCase(getAllComments.fulfilled, (state, action) => {
        const { post_id, comments } = action.payload;

        state.postId = post_id;
        state.comments[post_id] = comments; // 🔹 sirf us post ke liye update
      });
  },
});

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;
