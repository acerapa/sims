import { SalesConst } from '@/const/route.constants'

export default [
  {
    name: SalesConst.SALES,
    path: '/sales',
    component: () => import('@/layout/NavLayout.vue'),
    redirect: {
      name: SalesConst.SALES_ORDER
    },
    children: [
      {
        name: SalesConst.ITEM_DETAILS,
        path: '/item-details',
        component: () => import('@/views/sales/ItemDatails.vue'),
        meta: {
          title: 'Item Details',
          requiresAuth: true
        }
      },
      {
        name: SalesConst.SALES_ORDER_FORM,
        path: '/sales-order-form',
        component: () => import('@/views/sales/SalesOrderForm.vue'),
        meta: {
          title: 'Sales Order Form',
          requiresAuth: true
        }
      },
      {
        name: SalesConst.SALES_ORDER,
        path: '/sales-order',
        component: () => import('@/views/sales/SalesOrder.vue'),
        meta: {
          title: 'Sales Order',
          requiresAuth: true
        }
      },
      {
        path: '/customers',
        name: SalesConst.CUSTOMERS,
        component: () => import('@/views/sales/Customer.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/payment-methods',
        name: SalesConst.PAYMENT_METHODS,
        component: () => import('@/views/sales/PaymentMethod.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/invoices',
        name: SalesConst.INVOICES,
        component: () => import('@/views/sales/invoice/Invoice.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/invoice-form',
        name: SalesConst.INVOICE_FORM,
        component: () => import('@/views/sales/invoice/InvoiceForm.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/deliveries',
        name: SalesConst.DELIVERIES,
        component: () => import('@/views/sales/Delivery.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/received-payments',
        name: SalesConst.RECEIVED_PAYMENTS,
        component: () =>
          import('@/views/sales/receive-payment/ReceivePayments.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
