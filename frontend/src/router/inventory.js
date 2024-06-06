export default [
	{
		path: '/',
		component: () => import('@/layout/NavLayout.vue'),
		children: [
			{
				path: '/inventory',
				name: 'inventory',
				component: () => import('@/views/Inventory.vue')
			}
		]
	}
]
