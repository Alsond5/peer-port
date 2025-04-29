<script lang="ts">
    import type { SignalingMessage } from "$lib/webrtc/signaling";

    import { ConnectionManager } from "$lib/webrtc/connectionManager";
    import { fade, fly, scale } from "svelte/transition";
    import { formatBytes, getSignalingURL } from "$lib/webrtc/utils";

    let connectionManager: ConnectionManager | null;

    let isInitFiles: boolean = $state(false);
    let filesCount: number = $state(0);
    let fileUrl = $state("");
    let totalSize = $state(0);
    let dropzone: HTMLLabelElement | null = $state(null);
    let fileInput: HTMLInputElement | null = $state(null);
    let transferIsStarted: boolean = $state(false);
    let sendProgress: number = $state(0);
    let showCoppiedMessage: boolean = $state(false);
    let errorMessage = $state("");
    let isPaused = $state(false);
    let isCompleted = $state(false);

    const url = getSignalingURL();
    
    $effect(() => {
        if (showCoppiedMessage) {
            setTimeout(() => {
                showCoppiedMessage = false;
            }, 3000);
        }
    });

    $effect(() => {
        if (errorMessage !== "") {
            setTimeout(() => {
                errorMessage = ""
            }, 3000);
        }
    })
    
    $effect(() => {
        if (sendProgress === 100) {
            console.log("Effect girdi")
            isCompleted = true;
        }
    })

    const oncreate = (message: SignalingMessage) => {
        const hostname = window.location.hostname;

        fileUrl = `https://${hostname}/share/${message.payload.room_id}`;
    };

    const onprogressupdate = (sp: number) => {
        sendProgress = sp;
    };

    const ontransferstart = () => {
        transferIsStarted = true;
    };

    const onerror = (message: SignalingMessage) => {
        errorMessage = message.payload;
    }

    const onsocketerror = (event: Event) => {
        errorMessage = "A connection error occurred. Please try again.";

        resetFileSelection()
    }

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            const selectedFiles = input.files;
            connectionManager = new ConnectionManager({
                url: url,
                selectedFiles: selectedFiles
            });

            connectionManager.oncreate = oncreate;
            connectionManager.onprogressupdate = onprogressupdate;
            connectionManager.ontransferstart = ontransferstart;
            connectionManager.onerror = onerror;
            connectionManager.onsocketerror = onsocketerror;

            let currentTotalSize = 0;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                if (file) {
                    currentTotalSize += file.size;
                }
            }

            totalSize = currentTotalSize;
            console.log(totalSize)
            filesCount = selectedFiles.length;
            isInitFiles = true;

            connectionManager.connect();
        }
    }

    function pause() {
        connectionManager?.pause();
        isPaused = true;
    }

    function resume() {
        connectionManager?.resume();
        isPaused = false;
    }

    async function copy() {
        await navigator.clipboard.writeText(fileUrl);
        showCoppiedMessage = true;
    }

    // Dosya seçimini sıfırlama fonksiyonu
    function resetFileSelection() {
        connectionManager?.close();
        connectionManager = null;

        isInitFiles = false;
        filesCount = 0;
        fileUrl = "";
        totalSize = 0;
        isPaused = false;
        isCompleted = false;
        sendProgress = 0;
        transferIsStarted = false;

        if (fileInput) fileInput.value = "";
    }

    // QR kod oluşturma fonksiyonu (normalde bir kütüphane kullanırdık)
    function generateQRCode(url: string) {
        // Bu fonksiyon sadece görsel amaçlıdır, gerçek bir QR kod üretmez
        return `
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="80" height="80" fill="white"/>
          <rect x="30" y="30" width="10" height="10" fill="black"/>
          <rect x="40" y="30" width="10" height="10" fill="black"/>
          <rect x="50" y="30" width="10" height="10" fill="black"/>
          <rect x="30" y="40" width="10" height="10" fill="black"/>
          <rect x="50" y="40" width="10" height="10" fill="black"/>
          <rect x="30" y="50" width="10" height="10" fill="black"/>
          <rect x="50" y="50" width="10" height="10" fill="black"/>
          <rect x="80" y="30" width="10" height="10" fill="black"/>
          <rect x="30" y="80" width="10" height="10" fill="black"/>
          <rect x="80" y="80" width="10" height="10" fill="black"/>
          <rect x="60" y="60" width="10" height="10" fill="black"/>
          <rect x="70" y="70" width="10" height="10" fill="black"/>
          <rect x="60" y="80" width="10" height="10" fill="black"/>
          <rect x="70" y="60" width="10" height="10" fill="black"/>
        </svg>
      `;
    }

    // Alanın dışına sürükleme ve bırakma için gerekli fonksiyonlar
    function handleDragOver(event: DragEvent) {
        event.preventDefault();

        dropzone?.classList.add("border-blue-500", "bg-blue-100/50");
        dropzone?.classList.remove("border-blue-300", "bg-blue-50/30");
    }

    function handleDragLeave(event: DragEvent) {
        event.preventDefault();

        dropzone?.classList.remove("border-blue-500", "bg-blue-100/50");
        dropzone?.classList.add("border-blue-300", "bg-blue-50/30");
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();

        dropzone?.classList.remove("border-blue-500", "bg-blue-100/50");
        dropzone?.classList.add("border-blue-300", "bg-blue-50/30");

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const fileInput = document.getElementById(
                "dropzone-file",
            ) as HTMLInputElement;
            fileInput.files = event.dataTransfer.files;
            handleFileSelect({ target: fileInput } as unknown as Event);
        }
    }
</script>

<div class="fixed z-100 p-5 right-0 top-0">
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

<div class="flex items-center justify-center w-full">
    {#if !isInitFiles || fileUrl === ""}
        <!-- Dosya Yükleme Alanı -->
        <label
            for="dropzone-file"
            class="dropzone-area flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50/30 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-blue-100/30 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all duration-300"
            bind:this={dropzone}
            in:fade={{ duration: 300 }}
            ondragover={handleDragOver}
            ondragleave={handleDragLeave}
            ondrop={handleDrop}
        >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span>
                    or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Pick files freely
                </p>
            </div>
            <input
                id="dropzone-file"
                bind:this={fileInput}
                type="file"
                class="hidden"
                multiple
                onchange={handleFileSelect}
            />
        </label>
    {:else if transferIsStarted && isInitFiles}
        <div
            class="flex-col w-fit lg:ml-auto border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 py-8 px-10 flex items-center transition-all duration-300"
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
                        >{sendProgress !== 100
                            ? `${sendProgress}%`
                            : "Finished"}</span
                    >
                </div>
            </div>
            <div class="mt-5 w-full">
                {#if isCompleted}
                    <button onclick={resetFileSelection} type="button" class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-hidden focus:bg-red-200 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:bg-red-800/30 dark:hover:bg-red-800/20 dark:focus:bg-red-800/20">
                        Close
                    </button>
                {:else if !isPaused}
                    <button onclick={pause} type="button" class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20">
                        Pause
                    </button>
                {:else}
                    <button onclick={resume} type="button" class="flex items-center justify-center cursor-pointer w-full py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20">
                        Resume
                    </button>
                {/if}
            </div>
        </div>
    {:else}
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
                    {@html generateQRCode(fileUrl)}
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
                        onclick={resetFileSelection}
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
                        <label
                            for="hs-trailing-button-add-on-with-icon"
                            class="sr-only">Url</label
                        >
                        <div class="flex rounded-lg">
                            <input
                                type="text"
                                id="hs-trailing-button-add-on-with-icon"
                                value={fileUrl}
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
                                        <polyline points="20 6 9 17 4 12"
                                        ></polyline>
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
    {/if}
</div>
