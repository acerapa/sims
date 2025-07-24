<template>
	<div class="bg-gray-300 fixed top-0 left-0 w-screen h-screen flex flex-col items-center p-4">
		<div class="min-w-[70rem] max-w-7xl flex flex-col gap-3">
			<div class="flex justify-between items-center">
				<p>File name</p>
				<button class="btn">Print</button>
			</div>
			<RouterView />
		</div>
	</div>
</template>
