import { PurchaseConst, ReportConst, SalesConst } from '@/const/route.constants'

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
      },
      {
        name: SalesConst.SALES_BY_CUSTOMER_DETAILED,
        path: 'sales-by-customer-detailed-report',
        component: () => import('@/views/sales/SalesByCustomerDetailed.vue'),
        meta: {
          title: 'Sales By Customer Detailed Report',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/print/reports',
    name: ReportConst.PRINT_REPORT,
    component: () => import('@/layout/PrintableLayout.vue'),
    children: [
      {
        name: ReportConst.PRINT_PURCHASE_BY_VENDOR_DETAILED,
        path: 'purchase-by-vendor-detailed',
        component: () =>
          import('@/views/purchase/PurchaseByVendorPrintable.vue'),
        meta: {
          title: 'Purchase By Vendor Report',
          requiresAuth: true,
          filename: 'Purchase By Vendor Detailed Report'
        }
      },
      {
        name: ReportConst.PRINT_SALES_BY_CUSTOMER_DETAILED,
        path: 'sales-by-customer-detailed',
        component: () =>
          import(
            '@/views/sales/printables/SalesByCustomerDetailedPrintable.vue'
          ),
        meta: {
          title: 'Sales By Customer Detailed Report',
          requiresAuth: true,
          filename: 'Sales By Customer Detailed Report'
        }
      }
    ]
  }
]
