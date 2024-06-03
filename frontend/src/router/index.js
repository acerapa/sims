import { createRouter, createWebHistory } from 'vue-router';

import commonRoutes from './common';
import inventoryRoutes from './inventory';

const router = createRouter({
    history: createWebHistory(),
    routes: [...commonRoutes, ...inventoryRoutes]
});


export default router;
