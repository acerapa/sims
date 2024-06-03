export default [
    {
        path: '/',
        component: () => import('@/layout/NavLayout.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/vendors',
                name: 'vendors',
                component: () => import('@/views/Vendor.vue')
            },
            {
                path: '/customers',
                name: 'customers',
                component: () => import('@/views/Customer.vue')
            },
            {
                path: '/products',
                name: 'products',
                component: () => import('@/views/Product.vue')
            },
            {
                path: '/reports',
                name: 'reports',
                component: () => import('@/views/Report.vue')
            },
            {
                path: '/employees',
                name: 'employees',
                component: () => import('@/views/Employee.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue')
    }
]