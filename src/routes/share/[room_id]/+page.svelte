<script lang="ts">
    import { FileReceiver } from "$lib/webrtc/fileTransfer.js";
    import { Peer } from "$lib/webrtc/peer";
    import {
        SignalingClient,
        type SignalingMessage,
    } from "$lib/webrtc/signaling";
    import { fly } from "svelte/transition";

    let { data } = $props();

    let receiveProgress = $state(0);

    let fileReceiver: FileReceiver | null = null;

    const signaling = new SignalingClient("ws://192.168.1.154:8000/ws");
    const peer = new Peer(signaling, false);

    signaling.onopen = (event) => {
        const message: SignalingMessage = {
            type: "join",
            payload: {
                room_id: data.room_id,
            },
        };

        signaling.send(message);
    };

    signaling.onMessage((message) => {
        if (message.type === "ready") {
            console.log(message);
        }
    });

    peer.on("open", () => {
        console.log("DataChannel açık! Dosya gönderebilirsin.");
    });

    peer.on("message", (buffer) => {
        fileReceiver?.startReceivingFiles(buffer);
    });

    peer.on("error", (err) => console.error("Peer error", err));
    peer.on("close", () => console.log("Bağlantı kapandı."));

    $effect(() => {
        fileReceiver = new FileReceiver();
        fileReceiver.onupdate = (rp: number) => {
            receiveProgress = rp;
        };
        fileReceiver.oncomplete = (file: File) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        signaling.connect();
    });
</script>

<div class="flex grow items-center justify-center w-full mt-20">
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
                    >{receiveProgress !== 100 ? `${receiveProgress}%` : 'Finished'}</span
                >
            </div>
        </div>
    </div>
</div>
