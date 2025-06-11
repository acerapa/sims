<template>
  <div class="cont">Test</div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import StockStatusRow from '@/components/Inventory/StockStatus/StockStatusRow.vue'
import StockStatusHeader from '@/components/Inventory/StockStatus/StockStatusHeader.vue'
import Event from '@/event'

/** ================================================
 * EVENTS
 ** ================================================*/
const initStockStatusRow = 'init-stock-status-row'
Event.on(initStockStatusRow, function (data) {
  return { product: data }
})

const sampleData = [
  {
    category: 'Laptops',
    products: [
      {
        name: 'Dell latitude 5320',
        on_hand: 20,
        on_sale: 20,
        available: 0,
        ordered: true,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Laptop',
        on_hand: 20,
        on_sale: 20,
        available: 0,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: true,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  },
  {
    category: 'Smart Phone',
    products: [
      {
        name: 'Samsung Galaxy A03',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: false,
        on_po: 0,
        next_delivery: null
      },
      {
        name: 'Total Smart Phone',
        on_hand: 4,
        on_sale: 2,
        available: 2,
        ordered: '',
        on_po: 0,
        next_delivery: null
      }
    ]
  }
]
</script>
