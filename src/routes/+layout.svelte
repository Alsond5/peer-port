<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header
		class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-2 dark:bg-neutral-900 dark:border-neutral-700"
	>
		<nav
			class="flex flex-nowrap basis-full items-center w-full lg:max-w-[90rem] mx-auto px-4 md:px-8"
		>
			<a
				class="flex-none font-bold text-gray-800 sm:text-lg dark:text-white focus:outline-hidden focus:opacity-80"
				href="../index.html"
			>
				PeerPort
			</a>

			<div
				class="flex items-center ms-auto md:w-full md:gap-x-3 md:order-3 md:ms-0"
			>
				<div class="flex items-center relative z-10 ms-auto">
					<div class="lg:ms-1 flex">
						<a
							class="inline-flex items-center text-gray-800 p-2 text-sm font-medium rounded-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 text-blue-600! hover:text-blue-500 dark:text-blue-500! dark:hover:text-blue-400"
							href="/"
						>
							Transfer
						</a>
						<a
							class="inline-flex items-center text-gray-800 p-2 text-sm font-medium rounded-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
							href="/faq"
						>
							FAQ
						</a>
					</div>

					<div
						class="border-s border-gray-200 h-full ps-3.5 md:ps-5 ms-1 md:ms-2 dark:border-neutral-700"
					>
						<a
							class="text-black font-medium dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
							href="/changelog"
						>
							v0.1.1
						</a>
					</div>
				</div>
			</div>
		</nav>
	</header>

	<main class="grow h-full">
		<!-- Announcement Banner -->
		<div class="max-w-[90rem] my-3 px-4 sm:px-6 lg:px-8 mx-auto">
			<div
				class="bg-blue-600 bg-[url('https://preline.co/assets/svg/examples/abstract-1.svg')] bg-no-repeat bg-cover bg-center p-4 rounded-lg text-center"
			>
				<div class="flex flex-wrap justify-center items-center gap-2">
					<p class="inline-block text-white">
						Peer Port is open source.
					</p>
					<a
						class="py-1.5 px-2.5 md:py-2 md:px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-white text-white hover:border-white/70 hover:text-white/70 focus:outline-hidden focus:border-white/70 focus:text-white/70 disabled:opacity-50 disabled:pointer-events-none"
						href="https://github.com/Alsond5/peer-node"
					>
						GitHub
						<svg
							class="shrink-0 size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="m9 18 6-6-6-6" /></svg
						>
					</a>
				</div>
			</div>
		</div>
		<!-- End Announcement Banner -->
		{@render children()}
	</main>
</div>
