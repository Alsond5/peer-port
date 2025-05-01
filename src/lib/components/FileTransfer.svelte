<script lang="ts">
    import { FileTransferApp } from "$lib/FileTransferApp";
    import { getSignalingURL } from "$lib/webrtc/utils";

    import ConnectionInfo from "./ConnectionInfo.svelte";
    import FileUpload from "./FileUpload.svelte";
    import Progress from "./Progress.svelte";
    import Toast from "./Toast.svelte";

    let isInitFiles = $state(false);
    let transferIsStarted = $state(false);
    let shareUrl = $state("");
    let notification = $state("");
    let filesCount = $state(0);
    let totalSize = $state(0);
    let sendProgress = $state(0);
    let isCompleted = $state(false);
    let fileList: FileList | null = $state(null);

    const url = getSignalingURL();
    const fileTransferApp = new FileTransferApp("online", url);

    function handleFilesSelected(files: FileList) {
        fileList = files;
        isInitFiles = files.length > 0;

        let currentTotalSize = 0;

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            if (file) {
                currentTotalSize += file.size;
            }
        }

        totalSize = currentTotalSize;
        filesCount = fileList.length;
        isInitFiles = true;

        fileTransferApp.connect();
    }

    function resetFileSelections() {
        console.log("FileTransfer*")
        isInitFiles = false;
        filesCount = 0;
        shareUrl = "";
        totalSize = 0;
        transferIsStarted = false;
        sendProgress = 0;
        isCompleted = false;
        fileList = null;
    }

    function pause() {
        fileTransferApp.pause();
    }

    function resume() {
        fileTransferApp.resume();
    }
    
    fileTransferApp.signalEvents.on("create", (payload) => {
        const { protocol, hostname, port } = window.location;
        const url = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;

        const shareId = payload.share_id;

        shareUrl = `${url}/share/${shareId}`;
    });

    fileTransferApp.signalEvents.on("joined", (payload) => {
        const peerId = payload.peer_id;
        console.log(peerId);

        notification = `Peer joined!`
    });

    fileTransferApp.senderEvents.on("onstart", (peerId) => {
        transferIsStarted = true;
    })

    fileTransferApp.senderEvents.on("onprogress", (peerId, p) => {
        sendProgress = p;
    })

    fileTransferApp.peerEvents.on("datachannelopen", async (peerId) => {
        if (!fileList) return;
        
        await fileTransferApp.closeSignalServerConnection();

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            await fileTransferApp.sendFile(peerId, file);
        }

        isCompleted = true;
    })

    $effect(() => {
        return async () => {
            await fileTransferApp.disconnect()
        }
    });

    $effect(() => {
        if (notification !== "") {
            setTimeout(() => {
                notification = ""
            }, 3000);
        }
    })
</script>

{#if notification}
    <Toast
        notifacation={notification}
        notificationType={"success"}
    />
{/if}

<div class="flex items-center justify-center w-full">
    {#if !isInitFiles || shareUrl === ""}
        <FileUpload
            onFilesSelected={handleFilesSelected}
        />
    {:else if transferIsStarted && isInitFiles}
        <Progress
            onResetFileSelections={resetFileSelections}
            sendProgress={sendProgress}
            filesCount={filesCount}
            onPause={pause}
            onResume={resume}
        />
    {:else}
        <ConnectionInfo
            shareUrl={shareUrl}
            filesCount={filesCount}
            totalSize={totalSize}
            onResetFileSelections={resetFileSelections}
        />
    {/if}
</div>