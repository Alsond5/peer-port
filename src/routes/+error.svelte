<script lang="ts">
    import { page } from "$app/state";

    let message = $state("An unexpected error occurred.");

    $effect(() => {
        if (page.status === 404) {
            message = "Sorry, the page you are looking for could not be found.";
        } else if (page.status === 500) {
            message = "Sorry, something went wrong on our end.";
        } else if (page.status === 403) {
            message = "Sorry, you do not have permission to access this page.";
        } else if (page.status === 401) {
            message = "Please log in to access this page.";
        }
    })
</script>

<div class="grid min-h-full my-auto place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
        <p class="text-base font-semibold text-blue-600">{page.status}</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {page.error?.message}
        </h1>
        <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {message}
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="/"
                class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Go
                back home</a>
            <a href="/contact" class="text-sm font-semibold text-gray-900">Contact support <span
                    aria-hidden="true">&rarr;</span></a>
        </div>
    </div>
</div>