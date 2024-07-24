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
				path: 'product-settings',
				name: 'product-settings',
				component: () => import('@/views/Settings/ProductSettings.vue')
			},
			{
				path: 'account-settings',
				name: 'account-settings',
				component: () => import('@/views/Settings/Account.vue')
			}
		]
	}
]