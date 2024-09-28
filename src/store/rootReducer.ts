import { combineReducers } from '@reduxjs/toolkit';
import specialistReducer from './slices/specialistSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import clientReducer from './slices/clientSlice';
import appointmentReducer from './slices/appointmentsSlice'
import specializationReducer from './slices/specializationsSlice';
import notificationReducer from './slices/notificationsSlice';
import serviceReducer from './slices/servicesSlice';
import reviewReducer from './slices/reviewsSlice'

const rootReducer = combineReducers({
    specialists: specialistReducer,
    auth: authReducer,
    admins: adminReducer,
    clients: clientReducer,
    appointments: appointmentReducer,
    specializations: specializationReducer,
    notifications: notificationReducer,
    services: serviceReducer,
    reviews: reviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;