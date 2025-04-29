<script lang="ts">
    import { ConnectionManager } from "$lib/webrtc/connectionManager.js";
    import { type SignalingMessage } from "$lib/webrtc/signaling";
    import { formatBytes, getSignalingURL } from "$lib/webrtc/utils.js";
    import { fly } from "svelte/transition";

    let { data } = $props();

    let connectionManager: ConnectionManager | null;

    let receiveProgress = $state(0);
    let isReady = $state(false);
    let isLoading = $state(true);
    let errorMessage = $state("");
    let receivedFiles = $state<File[]>([]);

    const url = getSignalingURL();

    $effect(() => {
        if (errorMessage !== "") {
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
        }
    });

    const onprogressupdate = (sp: number) => {
        receiveProgress = sp;
    };

    const onreceivefile = (file: File) => {
        receivedFiles.push(file);
    };

    const onjoin = (message: SignalingMessage) => {
        isReady = true;
        isLoading = false;
    };

    const onerror = (message: SignalingMessage) => {
        errorMessage = message.payload;
        isLoading = false;
    };

    $effect(() => {
        connectionManager = new ConnectionManager({
            url: url,
            role: "receive",
            room_id: data.room_id,
        });

        connectionManager.onprogressupdate = onprogressupdate;
        connectionManager.onreceivefile = onreceivefile;
        connectionManager.onjoin = onjoin;
        connectionManager.onerror = onerror;

        connectionManager.connect();

        return () => {
            connectionManager?.close();
        };
    });

    const startFileTransfer = () => {
        connectionManager?.readyToFileReceive();
        isReady = false;
    };
</script>

<div class="fixed z-100 right-0 top-0 p-5">
    <!-- Toast -->
    <div
        class="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
        role="alert"
        hidden={errorMessage === ""}
        tabindex="-1"
        aria-labelledby="hs-toast-error-example-label"
    >
        <div class="flex p-4">
            <div class="shrink-0">
                <svg
                    class="shrink-0 size-4 text-red-500 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                    ></path>
                </svg>
            </div>
            <div class="ms-3">
                <p
                    id="hs-toast-error-example-label"
                    class="text-sm text-gray-700 dark:text-neutral-400"
                >
                    {errorMessage}
                </p>
            </div>
        </div>
    </div>
    <!-- End Toast -->
</div>

<div class="flex max-w-[90rem] px-4 py-10 mx-auto sm:px-6 lg:px-8 lg:py-14 flex-col items-center w-full">
    <div
        class="w-fit border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 p-8 flex items-center transition-all duration-300"
        in:fly={{ y: 20, duration: 400 }}
    >
        <div class="relative size-38">
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
                    stroke-dashoffset={100 - receiveProgress}
                    stroke-linecap="round"
                ></circle>
            </svg>

            <!-- Percentage Text -->
            <div
                class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2"
            >
                <span
                    class="text-center text-xl font-bold text-blue-600 dark:text-blue-500"
                    >{receiveProgress !== 100
                        ? `${receiveProgress}%`
                        : "Finished"}</span
                >
            </div>
        </div>
    </div>

    <div class="mt-8 w-55">
        <button
            type="button"
            onclick={startFileTransfer}
            class="w-full py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20"
            disabled={!isReady}
        >
            {#if isLoading}
                <span
                    class="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                    role="status"
                    aria-label="loading"
                >
                    <span class="sr-only">Loading...</span>
                </span>
            {:else if errorMessage !== ""}
                Error
            {:else}
                Start
            {/if}
        </button>
    </div>
</div>

<!-- Table Section -->
<div class="max-w-[90rem] w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Card -->
    <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div
                    class="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700"
                >
                    <!-- Header -->
                    <div
                        class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700"
                    >
                        <div>
                            <h2
                                class="text-xl font-semibold text-gray-800 dark:text-neutral-200"
                            >
                                Received Files
                            </h2>
                            <p
                                class="text-sm text-gray-600 dark:text-neutral-400"
                            >
                                List of all received files and save
                            </p>
                        </div>

                        <div>
                            <div class="inline-flex">
                                <button
                                    type="button"
                                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Save all
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- End Header -->

                    <!-- Table -->
                    <table
                        class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700"
                    >
                        <thead class="bg-gray-50 dark:bg-neutral-800">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-start"
                                >
                                    <p
                                        class="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                    >
                                        File Name
                                        <svg
                                            class="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            ><path d="m7 15 5 5 5-5" /><path
                                                d="m7 9 5-5 5 5"
                                            /></svg
                                        >
                                    </p>
                                </th>

                                <th
                                    scope="col"
                                    class="px-6 py-3 text-start"
                                >
                                    <p
                                        class="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                    >
                                        Size
                                        <svg
                                            class="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            ><path d="m7 15 5 5 5-5" /><path
                                                d="m7 9 5-5 5 5"
                                            /></svg
                                        >
                                    </p>
                                </th>

                                <th scope="col" class="px-6 py-3 text-end"
                                ></th>
                            </tr>
                        </thead>

                        <tbody
                            class="divide-y divide-gray-200 dark:divide-neutral-700"
                        >
                            {#each receivedFiles as file}
                                <tr
                                    class="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                                >
                                    <th scope="row" class="size-px whitespace-nowrap text-start">
                                        <div class="block relative z-10">
                                            <div class="px-6 py-2">
                                                <div
                                                    class="block text-blue-500 dark:text-blue-300"
                                                >
                                                    <p class="text-sm">{file.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                    
                                    <td class="size-px whitespace-nowrap">
                                        <p class="block text-sm text-gray-800 relative z-10">
                                            {formatBytes(file.size)}
                                        </p>
                                    </td>

                                    <td class="size-px whitespace-nowrap">
                                        <div class="flex px-6 py-2">
                                            <div
                                                class="hs-dropdown [--placement:bottom-right] relative ml-auto inline-block"
                                            >
                                                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 focus:outline-hidden focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    <!-- End Table -->

                    <!-- Footer -->
                    <div
                        class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700"
                    >
                        <div>
                            <p
                                class="text-sm text-gray-600 dark:text-neutral-400"
                            >
                                <span
                                    class="font-semibold text-gray-800 dark:text-neutral-200"
                                    >{receivedFiles.length}</span
                                > files
                            </p>
                        </div>
                    </div>
                    <!-- End Footer -->
                </div>
            </div>
        </div>
    </div>
    <!-- End Card -->
</div>
<!-- End Table Section -->
