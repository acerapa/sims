export default [
	{
		path: '/',
		component: () => import('@/views/layout/NavLayout.vue'),
		children: [
			{
				path: '/inventory',
				name: 'inventory',
				component: () => import('@/views/Inventory.vue')
			}
		]
	}
]
