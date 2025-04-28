<script lang="ts">
    import type { SignalingMessage } from "$lib/webrtc/signaling";

    import { ConnectionManager } from "$lib/webrtc/connectionManager";
    import { fade, fly } from "svelte/transition";
    import { getSignalingURL } from "$lib/webrtc/utils";

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

    const url = getSignalingURL();
    
    $effect(() => {
        if (showCoppiedMessage) {
            setTimeout(() => {
                showCoppiedMessage = false;
            }, 3000);
        }
    });

    const oncreate = (message: SignalingMessage) => {
        fileUrl = `http://192.168.1.154:5173/share/${message.payload.room_id}`;
    };

    const onprogressupdate = (sp: number) => {
        sendProgress = sp;
    };

    const ontransferstart = () => {
        transferIsStarted = true;
    };

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

    function formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
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

<div class="flex items-center justify-center w-full">
    {#if !isInitFiles}
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
            class="w-fit h-64 ml-auto border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 p-10 flex items-center transition-all duration-300"
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
        </div>
    {:else}
        <!-- Dosya Bilgisi ve QR Kod Gösterimi -->
        <div
            class="w-full h-64 border-2 border-blue-300 rounded-lg bg-white dark:bg-gray-700 p-4 flex items-center transition-all duration-300"
            in:fly={{ y: 20, duration: 400 }}
        >
            <!-- Sol Taraf - QR Kod -->
            <div
                class="w-1/3 flex items-center justify-center p-2 border-r border-gray-200 dark:border-gray-600"
            >
                <div class="bg-white p-2 rounded">
                    {@html generateQRCode(fileUrl)}
                </div>
            </div>

            <!-- Sağ Taraf - Dosya Bilgileri -->
            <div class="w-2/3 py-2 h-36 px-6 flex flex-col">
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
