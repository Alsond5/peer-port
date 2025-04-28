<script lang="ts">
    import { ConnectionManager } from "$lib/webrtc/connectionManager.js";
    import { type SignalingMessage } from "$lib/webrtc/signaling";
    import { getSignalingURL } from "$lib/webrtc/utils.js";
    import { fly } from "svelte/transition";

    let { data } = $props();

    let connectionManager: ConnectionManager | null;

    let receiveProgress = $state(0);
    let isReady = $state(false);
    let isLoading = $state(true);
    let errorMessage = $state("");

    const url = getSignalingURL();

    $effect(() => {
        if (errorMessage !== "") {
            setTimeout(() => {
                errorMessage = ""
            }, 3000);
        }
    })

    const onprogressupdate = (sp: number) => {
        receiveProgress = sp;
    };

    const onreceivefile = (file: File) => {
        const link = document.createElement("a");
        
        link.href = URL.createObjectURL(file);
        link.download = file.name;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    };

    const onjoin = (message: SignalingMessage) => {
        isReady = true;
        isLoading = false;
    }

    const onerror = (message: SignalingMessage) => {
        errorMessage = message.payload;
        isLoading = false;
    }

    $effect(() => {
        connectionManager = new ConnectionManager({
            url: url,
            role: "receive",
            room_id: data.room_id
        });

        connectionManager.onprogressupdate = onprogressupdate;
        connectionManager.onreceivefile = onreceivefile;
        connectionManager.onjoin = onjoin;
        connectionManager.onerror = onerror;

        connectionManager.connect();
    });

    const startFileTransfer = () => {
        connectionManager?.readyToFileReceive();
    };
</script>

<div class="absolute right-0 bottom-10">
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
                    { errorMessage }
                </p>
            </div>
        </div>
    </div>
    <!-- End Toast -->
</div>

<div class="flex flex-col grow items-center justify-center w-full mt-20">
    <div
        class="w-fit h-64 border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 p-10 flex items-center transition-all duration-300"
        in:fly={{ y: 20, duration: 400 }}
    >
        <div class="relative size-40">
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

    <div class="mt-12 w-62">
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
            {:else if !isLoading && !isReady}
                Error
            {:else}
                Start
            {/if}
        </button>
    </div>
</div>
