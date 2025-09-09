/**
 * steps for state management
 * 
 * Submit Action
 * Handle action in its reducer
 * register here -> reducer
 * 
 */

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/AuthReducer"
import postReducer from "./reducer/PostReducer"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer
    }
})