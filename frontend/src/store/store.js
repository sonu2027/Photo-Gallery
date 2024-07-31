import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import passwordReq from './passwordReq';

const store = configureStore({
    reducer: {
        auth : authSlice,
        changePasswordReq: passwordReq
        //TODO: add more slices here for posts
    }
});


export default store;