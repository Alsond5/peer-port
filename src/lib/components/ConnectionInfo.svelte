<script lang="ts">
    import { formatBytes } from "$lib/webrtc/utils";
    import { fly } from "svelte/transition";

    let { shareUrl, filesCount, totalSize, onResetFileSelections } = $props();

    let showCoppiedMessage: boolean = $state(false);

    function generateQRCode(url: string) {

    }

    async function copy() {
        await navigator.clipboard.writeText(shareUrl);
        showCoppiedMessage = true;
    }
</script>

<!-- Dosya Bilgisi ve QR Kod Gösterimi -->
<div
    class="flex flex-col lg:flex-row w-full gap-3 border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 p-2 lg:p-4 flex items-center transition-all duration-300"
    in:fly={{ y: 20, duration: 400 }}
>
    <!-- Sol Taraf - QR Kod -->
    <div
        class="w-full lg:w-1/3 flex items-center justify-center p-2 border-b lg:border-r lg:border-b-0 border-gray-200 dark:border-gray-600"
    >
        <div class="bg-white p-2 rounded">
            {@html generateQRCode(shareUrl)}
        </div>
    </div>

    <!-- Sağ Taraf - Dosya Bilgileri -->
    <div class="w-full lg:w-2/3 p-2 flex flex-col">
        <div class="flex items-center justify-between mb-1">
            <h3
                class="font-medium text-lg text-gray-800 dark:text-gray-200 truncate max-w-xs"
            >
                {filesCount} selected files
            </h3>
            <button
                class="flex items-center justify-center text-red-500 bg-white hover:bg-red-50 cursor-pointer size-8 rounded-lg transition-colors"
                onclick={() => { console.log("ConnectionInfo*"); onResetFileSelections(); }}
                aria-label="cancel"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>

        <!-- Dosya Detayları -->
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{formatBytes(totalSize, 2)}</span>
        </div>

        <!-- Paylaşım URL'i -->
        <div class="mt-auto">
            <div>
                <label for="hs-trailing-button-add-on-with-icon" class="sr-only"
                    >Url</label
                >
                <div class="flex rounded-lg">
                    <input
                        type="text"
                        id="hs-trailing-button-add-on-with-icon"
                        value={shareUrl}
                        name="hs-trailing-button-add-on-with-icon"
                        class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-s-lg text-slate-700 font-medium sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        readonly
                    />
                    <button
                        type="button"
                        class="size-11.5 shrink-0 inline-flex justify-center cursor-pointer items-center border border-blue-200 gap-x-2 text-sm font-semibold rounded-e-md border-l-0 bg-white text-blue-700 hover:bg-blue-50 focus:outline-hidden focus:bg-blue-50 disabled:opacity-50 disabled:pointer-events-none"
                        onclick={copy}
                    >
                        {#if showCoppiedMessage}
                            <svg
                                class="js-clipboard-success shrink-0 size-3 md:size-3.5 text-blue-600 rotate-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        {:else}
                            <svg
                                class="js-clipboard-default shrink-0 size-3 md:size-3.5 group-hover:rotate-6 transition"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    width="8"
                                    height="4"
                                    x="8"
                                    y="2"
                                    rx="1"
                                    ry="1"
                                ></rect>
                                <path
                                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                                ></path>
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
