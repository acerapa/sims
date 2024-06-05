import { createRouter, createWebHistory } from 'vue-router';

import commonRoutes from './common';
import inventoryRoutes from './inventory';
import settingsRoutes from './settings';

const router = createRouter({
    history: createWebHistory(),
    routes: [...commonRoutes, ...inventoryRoutes, ...settingsRoutes]
});


export default router;
