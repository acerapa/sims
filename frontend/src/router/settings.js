export default [
	{
		path: '/settings',
		name: 'setting',
		redirect: {
			name: 'product-categories'
		},
		component: () => import('@/layout/NavLayout.vue'),
		children: [
			{
				path: 'product-categories',
				name: 'product-categories',
				component: () => import('@/views/Settings/ProductCategory.vue')
			},
			{
				path: 'product-settings',
				name: 'product-settings',
				component: () => import('@/views/Settings/ProductCategory.vue')
			}
		]
	}
]