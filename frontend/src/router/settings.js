export default [
	{
		path: '/settings',
		name: 'setting',
		redirect: {
			name: 'account-settings'
		},
		component: () => import('@/layout/NavLayout.vue'),
		children: [
			{
				path: 'product-categories',
				name: 'product-categories',
				component: () => import('@/views/Settings/ProductCategory.vue')
			},
			{
				path: 'account-settings',
				name: 'account-settings',
				component: () => import('@/views/Settings/Account.vue')
			}
		]
	}
]