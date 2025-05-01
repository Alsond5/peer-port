<script lang="ts">
    import { fly } from "svelte/transition";

    let {
        onResetFileSelections,
        sendProgress,
        filesCount,
        onPause,
        onResume
    } = $props();
    
    let isPaused = $state(false);
    let sentFilesCount = $state(0);
    let isCompleted = $derived(filesCount === sentFilesCount);

    let prevProgress = 0;

    function pause() {
        onPause();

        isPaused = true;
    }

    function resume() {
        onResume();
        
        isPaused = false;
    }
    
    function resetFileSelections() {
        console.log("Progress*")

        sendProgress = 0;
        sentFilesCount = 0;
        isPaused = false;

        onResetFileSelections()
    }

    $effect(() => {
        if (sendProgress === 100 && prevProgress !== 100) sentFilesCount++;

        prevProgress = sendProgress;
    })
</script>

<div
    class="flex-col w-fit lg:ml-auto border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 py-8 px-10 flex items-center transition-all duration-300"
    in:fly={{ y: 20, duration: 400 }}
>
    <div>
        {#if isCompleted}
            <p class="text-sm text-green-500">All files sent!</p>
        {:else}
            <p class="text-sm text-slate-500">Sending file {sentFilesCount + 1} of {filesCount}</p>
        {/if}
    </div>
    <div class="relative size-40 mt-5">
        <svg
            class="size-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
        >
            <!-- Background Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="stroke-current text-gray-200 dark:text-neutral-700"
                stroke-width="2"
            ></circle>
            <!-- Progress Circle -->
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                class="stroke-current text-blue-600 dark:text-blue-500"
                stroke-width="2"
                stroke-dasharray="100"
                stroke-dashoffset={100 - sendProgress}
                stroke-linecap="round"
            ></circle>
        </svg>

        <!-- Percentage Text -->
        <div
            class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2"
        >
            <span
                class="text-center text-xl font-bold text-blue-600 dark:text-blue-500"
                >{sendProgress !== 100 ? `${sendProgress}%` : "Finished"}</span
            >
        </div>
    </div>
    <div class="mt-5 w-full">
        {#if isCompleted}
            <button
                onclick={resetFileSelections}
                type="button"
                class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-hidden focus:bg-red-200 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:bg-red-800/30 dark:hover:bg-red-800/20 dark:focus:bg-red-800/20"
            >
                Close
            </button>
        {:else if !isPaused}
            <button
                onclick={pause}
                type="button"
                class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20"
            >
                Pause
            </button>
        {:else}
            <button
                onclick={resume}
                type="button"
                class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20"
            >
                Resume
            </button>
        {/if}
    </div>
</div>
