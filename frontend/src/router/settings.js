export default [
	{
		path: '/settings',
		redirect: '/settings/product-categories',
		component: () => import('@/layout/NavLayout.vue'),
		children: [
			{
				path: 'product-categories',
				name: 'product-categories',
				component: () => import('@/views/Settings/ProductCategory.vue')
			}
		]
	}
]