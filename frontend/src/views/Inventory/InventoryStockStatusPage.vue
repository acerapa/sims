<template>
  <div>
    <CustomTable
      :is-nested="true"
      :has-add-btn="false"
      :has-pagination="false"
      :table-header-component="StockStatusHeader"
    >
      <template v-slot:tables>
        <div v-for="(cat, ndx) in sampleData" :key="ndx">
          <CustomTable
            :has-tools="false"
            :has-add-btn="false"
            :data="cat.products"
            :title="cat.category"
            :has-pagination="false"
            :row-prop-init="initStockStatusRow"
            :table-row-component="StockStatusRow"
          ></CustomTable>
        </div>
      </template>
    </CustomTable>

    <!-- NOTES -->
    <div class="flex flex-col">
      <div class="flex gap-3">
        <input type="checkbox" name="" id="" />
        <code>Query all the products grouped by categories</code>
      </div>
      <div class="flex gap-3">
        <input type="checkbox" name="" id="" />
        <code>
          Create a table with columns of [item-description, on hand, on sale,
          avaliable, Ordered, On PO, Next Delivery]
        </code>
      </div>
      <div class="flex gap-3">
        <input type="checkbox" name="" id="" />
        <code>
          Needs to keep track of all products track, wether incoming or outgoing
        </code>
      </div>
    </div>
  </div>
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
