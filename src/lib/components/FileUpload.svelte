<script lang="ts">
    import { fade } from "svelte/transition";

    let { onFilesSelected } = $props()

    let dropzone: HTMLLabelElement | null = $state(null);
    let fileInput: HTMLInputElement | null = $state(null);

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            const selectedFiles = input.files;

            onFilesSelected(selectedFiles);
        }
    }

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

        if (!fileInput) return;

        dropzone?.classList.remove("border-blue-500", "bg-blue-100/50");
        dropzone?.classList.add("border-blue-300", "bg-blue-50/30");

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            fileInput.files = event.dataTransfer.files;
            handleFileSelect({ target: fileInput } as unknown as Event);
        }
    }
</script>

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
    <div class="flex flex-col items-center justify-center py-5">
        <svg
            class="size-9 mb-4 text-blue-500 dark:text-gray-400"
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
        <p class="mb-2 text-sm text-slate-500 dark:text-gray-400">
            <span class="font-semibold">Click to upload</span>
            or drag and drop
        </p>
        <p class="text-xs text-slate-500 dark:text-gray-400">
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