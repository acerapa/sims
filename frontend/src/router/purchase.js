import { PurchaseConst } from './constants/route.constants'

export default [
  {
    path: '/purchase',
    name: PurchaseConst.PURCHASE,
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: PurchaseConst.PURCHASE_ORDER
    },
    children: [
      {
        path: '/purchase-order',
        name: PurchaseConst.PURCHASE_ORDER,
        component: () => import('@/views/purchase/PurchaseOrder.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/purchase-order-form',
        name: PurchaseConst.PURCHASE_ORDER_FORM,
        component: () => import('@/views/purchase/PurchaseOrderForm.vue'),
        meta: {
          requiresAuth: true,
          title: 'Purchase Order Form'
        }
      },
      {
        path: '/purchase-receive-order/:id',
        name: PurchaseConst.PURCHASE_RECEIVE_ORDER,
        component: () => import('@/views/purchase/ReceiveOrder.vue'),
        meta: {
          title: 'Receive Order',
          requiresAuth: true
        }
      },
      {
        path: '/vendors',
        name: PurchaseConst.VENDORS,
        component: () => import('@/views/purchase/Vendor.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
