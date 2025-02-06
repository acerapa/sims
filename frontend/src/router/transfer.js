import { TransferConst } from './constants/route.constants'

export default [
  {
    path: '/transfer',
    name: TransferConst.TRANSFER,
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: TransferConst.STR_LIST
    },
    children: [
      {
        path: '/ibrr-list',
        name: TransferConst.IBRR_LIST,
        component: () => import('@/views/StockTransfer/ibrr-list.vue'),
        meta: {
          requiresAuth: true,
          title: 'Inter Branch Receive Report List'
        }
      },
      {
        path: '/ibrr-form',
        name: TransferConst.IBRR_FORM,
        component: () => import('@/views/StockTransfer/ibrr-form.vue'),
        meta: {
          requiresAuth: true,
          title: 'Inter Branch Receive Report Form'
        }
      },
      {
        path: '/str-list',
        name: TransferConst.STR_LIST,
        component: () => import('@/views/StockTransfer/str-list.vue'),
        meta: {
          requiresAuth: true,
          title: 'Stock Transfer Report List'
        }
      },
      {
        path: '/str-form',
        name: TransferConst.STR_FORM,
        component: () => import('@/views/StockTransfer/str-form.vue'),
        meta: {
          requiresAuth: true,
          title: 'Stock Transfer Report Form'
        }
      },
      {
        path: 'rma-list',
        name: TransferConst.RMA_LIST,
        component: () => import('@/views/StockTransfer/rma-list.vue'),
        meta: {
          title: 'Return Merchandise Authority List',
          requiresAuth: true
        }
      },
      {
        path: 'rma-form',
        name: TransferConst.RMA_FORM,
        component: () => import('@/views/StockTransfer/rma-form.vue'),
        meta: {
          title: 'Return Merchandise Authority Form',
          requiresAuth: true
        }
      },
      {
        path: 'fix-asset',
        name: TransferConst.FIX_ASSET_LIST,
        component: () => import('@/views/StockTransfer/fix-asset-list.vue'),
        meta: {
          title: 'PO to Fixed Asset List',
          requiresAuth: true
        }
      },
      {
        path: 'fix-asset-form',
        name: TransferConst.FIX_ASSET_FORM,
        component: () => import('@/views/StockTransfer/fix-asset-form.vue'),
        meta: {
          title: 'Fixed Asset Form',
          requiresAuth: true
        }
      }
    ]
  }
]
