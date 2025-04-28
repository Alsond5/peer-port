<script lang="ts">
    import { FileTransfer } from '$lib/webrtc/fileTransfer';
    import { Peer } from '$lib/webrtc/peer';
    import { SignalingClient, type SignalingMessage } from '$lib/webrtc/signaling';
    import { fade, fly } from "svelte/transition";

    let selectedFiles: FileList | null = $state(null);
    let fileUrl = $state("");
    let previewUrl = $state("");
    let totalSize = $state(0);
    let dropzone: HTMLLabelElement | null = $state(null);
    let transferIsStarted: boolean = $state(false);
    let sendProgress: number = $state(0);
    
    const signaling = new SignalingClient('ws://192.168.1.154:8000/ws');
    const peer = new Peer(signaling, true);

    signaling.onopen = (event) => {
        const message: SignalingMessage = {
            type: "join",
            payload: {
                room_id: null
            }
        }

        signaling.send(message);
    }

    signaling.onMessage(async (message) => {
        if (message.type === "create") {
            console.log(message);

            fileUrl = `http://192.168.1.154:5173/share/${message.payload.room_id}`;
            signaling.clientId = message.payload.client_id as string;
        }
        
        else if (message.type === "ready") {
            signaling.peerId = message.payload.peer_id;
            await peer.start()
        }
    })

    peer.on('open', () => {
        console.log('DataChannel açık! Dosya gönderebilirsin.');

        const message: SignalingMessage = {
            type: "bye",
            payload: {}
        }

        signaling.send(message);

        if (selectedFiles && selectedFiles.length > 0) {
            const fileTransfer = new FileTransfer(selectedFiles, peer, (sp: number) => {
                sendProgress = sp;
            });

            transferIsStarted = true;
            fileTransfer.startFileTransfer()
        }
    });

    peer.on('message', (buffer) => {
        console.log('Dosya geldi:', buffer);
    });

    peer.on('error', (err) => console.error('Peer error', err));
    peer.on('close', () => console.log('Bağlantı kapandı.'));
    
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            signaling.connect();

            selectedFiles = input.files;

            let currentTotalSize = 0;
            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    if (file) {
                        currentTotalSize += file.size;
                    }
                }
            }

            totalSize = currentTotalSize;
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

    // Dosya seçimini sıfırlama fonksiyonu
    function resetFileSelection() {
        signaling.close()

        selectedFiles = null;
        fileUrl = "";
        previewUrl = "";
        totalSize = 0;
        const fileInput = document.getElementById(
            "dropzone-file",
        ) as HTMLInputElement;
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
    {#if !selectedFiles}
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
                type="file"
                class="hidden"
                multiple
                onchange={handleFileSelect}
            />
        </label>
    {:else if transferIsStarted && selectedFiles}
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
                        >{sendProgress !== 100 ? `${sendProgress}%` : 'Finished'}</span
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
                <div class="flex items-center justify-between mb-2">
                    <h3
                        class="font-medium text-lg text-gray-800 dark:text-gray-200 truncate max-w-xs"
                    >
                        {selectedFiles.length} selected files
                    </h3>
                    <button
                        class="text-red-500 hover:text-red-700 transition-colors"
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
                    <span class="mx-2">•</span>
                    <span class="text-green-500">Ready</span>
                </div>

                <!-- Paylaşım URL'i -->
                <div class="mt-auto">
                    <div class="flex items-center w-full">
                        <input
                            type="text"
                            value={fileUrl}
                            readonly
                            class="flex-grow p-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l text-gray-800 dark:text-gray-200 focus:outline-none"
                        />
                        <button
                            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r text-xs transition-colors"
                            onclick={() =>
                                navigator.clipboard.writeText(fileUrl)}
                        >
                            Kopyala
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
