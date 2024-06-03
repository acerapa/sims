<template>
  <div class="table-wrapper bg-white w-full flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button class="bg-primary p-2 rounded">
        <img src="../assets//icons/plus.svg" alt="Plus" />
      </button>
    </div>
    <hr class="bg-gray-50 -mx-4" />
    <div class="flex flex-col gap-7 min-w-[792px] overflow-x-auto">
      <div class="grid grid-cols-13 gap-3 items-center">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">First Name</p>
        <p class="col-span-2 table-header">Last Name</p>
        <p class="col-span-2 table-header">Position</p>
        <p class="col-span-2 table-header">Date Started</p>
        <p class="col-span-2 table-header">Date Ended</p>
        <p class="col-span-1 table-header">Status</p>
        <p class="col-span-1 table-header">Action</p>
      </div>
      <div class="grid grid-cols-13 gap-3 items-center">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="text-base">#</p>
        </div>
        <p class="col-span-2 text-base">Harvey</p>
        <p class="col-span-2 text-base">Aparece</p>
        <p class="col-span-2 text-base">Admin</p>
        <p class="col-span-2 text-base">04/02/2024</p>
        <p class="col-span-2 text-base">06/02/2024</p>
        <p class="col-span-1 text-base">Active</p>
        <p class="col-span-1 text-base">:</p>
      </div>
      <div class="grid grid-cols-13 gap-3 items-center">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="text-base">#</p>
        </div>
        <p class="col-span-2 text-base">Harvey</p>
        <p class="col-span-2 text-base">Aparece</p>
        <p class="col-span-2 text-base">Admin</p>
        <p class="col-span-2 text-base">04/02/2024</p>
        <p class="col-span-2 text-base">06/02/2024</p>
        <p class="col-span-1 text-base">Active</p>
        <p class="col-span-1 text-base">:</p>
      </div>
      <div class="grid grid-cols-13 gap-3 items-center">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="text-base">#</p>
        </div>
        <p class="col-span-2 text-base">Harvey</p>
        <p class="col-span-2 text-base">Aparece</p>
        <p class="col-span-2 text-base">Admin</p>
        <p class="col-span-2 text-base">04/02/2024</p>
        <p class="col-span-2 text-base">06/02/2024</p>
        <p class="col-span-1 text-base">Active</p>
        <p class="col-span-1 text-base">:</p>
      </div>
    </div>
  </div>
</template>
