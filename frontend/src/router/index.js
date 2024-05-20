import { createRouter, createWebHistory } from 'vue-router';

import commonRoutes from './common';

const router = createRouter({
    history: createWebHistory(),
    routes: [ ...commonRoutes ]
});


export default router;
