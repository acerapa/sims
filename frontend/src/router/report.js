import { PurchaseConst } from '@/const/route.constants'

export default [
  {
    path: '/',
    name: 'reports',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: PurchaseConst.PURCHASE_BY_VENDOR_DETAILED_REPORT
    },
    children: [
      {
        name: PurchaseConst.PURCHASE_BY_VENDOR_DETAILED_REPORT,
        path: 'purchase-by-vendor',
        component: () => import('@/views/purchase/PurchaseByVendor.vue'),
        meta: {
          title: 'Purchase By Vendor',
          requiresAuth: true
        }
      },
      {
        name: PurchaseConst.PURCHASE_BY_VENDOR_SUMMARY_REPORT,
        path: 'purchase-by-vendor-summary',
        component: () => import('@/views/purchase/PurchaseByVendorSummary.vue'),
        meta: {
          title: 'Purchase By Vendor Summary',
          requiresAuth: true
        }
      }
    ]
  }
]
