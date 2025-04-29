<script lang="ts">
    import { page } from "$app/state";
    import { version } from "$lib/version";
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
				class="flex items-center flex-none font-bold text-gray-800 sm:text-lg dark:text-white focus:outline-hidden focus:opacity-80"
				href="/"
			>
				PeerPort
				<span
					class="block ml-2 text-xs text-white bg-blue-500 py-1 px-1.5 font-bold rounded h-fit"
					>BETA</span
				>
			</a>

			<div
				class="flex items-center ms-auto md:w-full md:gap-x-3 md:order-3 md:ms-0"
			>
				<div class="flex items-center relative z-10 ms-auto">
					<div class="lg:ms-1 flex">
						<a
							class="inline-flex items-center {page.url.pathname === "/" ? 'text-blue-600! dark:text-blue-500! hover:text-blue-500 dark:hover:text-blue-400' : 'text-gray-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-neutral-400'} p-2 text-sm font-medium rounded-lg focus:outline-hidden focus:text-blue-600 dark:focus:text-neutral-400"
							href="/"
						>
							Transfer
						</a>
						<a
							class="inline-flex items-center {page.url.pathname === "/faq" ? 'text-blue-600! dark:text-blue-500! hover:text-blue-500 dark:hover:text-blue-400' : 'text-gray-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-neutral-400'} p-2 text-sm font-medium rounded-lg focus:outline-hidden focus:text-blue-600 dark:focus:text-neutral-400"
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
							v{version}
						</a>
					</div>
				</div>
			</div>
		</nav>
	</header>

	<main class="flex flex-col grow h-full">
		{@render children()}
	</main>

	<footer
		class="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto"
	>
		<!-- Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
			<div>
				<a
					class="flex-none text-xl font-semibold text-black focus:outline-hidden dark:text-white"
					href="/"
					aria-label="Brand">PeerPort</a
				>
			</div>
			<!-- End Col -->

			<ul class="text-center">
				<li
					class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600"
				>
					<a
						class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
						href="/about"
					>
						About
					</a>
				</li>
				<li
					class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600"
				>
					<a
						class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
						href="/contact"
					>
						Contact
					</a>
				</li>
				<li
					class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600"
				>
					<a
						class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
						href="/privacy"
					>
						Privacy
					</a>
				</li>
			</ul>
			<!-- End Col -->

			<!-- Social Brands -->
			<div class="md:text-end space-x-2">
				<a
					aria-label="GitHub"
					class="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
					href="https://github.com/Alsond5/peer-port"
				>
					<svg
						class="shrink-0 size-3.5"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
						/>
					</svg>
				</a>
			</div>
			<!-- End Social Brands -->
		</div>
		<!-- End Grid -->
	</footer>
</div>
