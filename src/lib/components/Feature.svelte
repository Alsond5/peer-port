<script lang="ts">
    interface Props {
        position: 'left' | 'right';
        image_url: string;
        title: string;
        text: string;
        article1: string;
        article2: string;
        article3: string;
    }

    let {
        position,
        image_url,
        title,
        text,
        article1,
        article2,
        article3
    }: Props = $props()

</script>

<!-- Features -->
<div class="max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Grid -->
    <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div class="flex items-center justify-center {position === 'right' ? 'md:order-2' : 'md:order-1'} bg-blue-50 rounded-3xl w-120 h-120 p-10">
            <img
                class="rounded-xl max-w-full max-h-full object-contain"
                src={image_url}
                alt="Features"
            />
        </div>
        <!-- End Col -->

        <div class="mt-5 {position === 'left' ? 'md:order-2' : 'md:order-1'} sm:mt-10 lg:mt-0">
            <div class="space-y-6 sm:space-y-8">
                <!-- Title -->
                <div class="space-y-2 md:space-y-4">
                    <h2
                        class="font-bold text-3xl lg:text-4xl text-gray-800 dark:text-neutral-200"
                    >
                        {title}
                    </h2>
                    <p class="text-gray-500 dark:text-neutral-500">
                        {text}
                    </p>
                </div>
                <!-- End Title -->

                <!-- List -->
                <ul class="space-y-2 sm:space-y-4">
                    <li class="flex gap-x-3">
                        <span
                            class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
                        >
                            <svg
                                class="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><polyline points="20 6 9 17 4 12" /></svg
                            >
                        </span>
                        <div class="grow">
                            <span
                                class="text-sm sm:text-base text-gray-500 dark:text-neutral-500"
                            >
                                {@html article1}
                            </span>
                        </div>
                    </li>

                    <li class="flex gap-x-3">
                        <span
                            class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
                        >
                            <svg
                                class="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><polyline points="20 6 9 17 4 12" /></svg
                            >
                        </span>
                        <div class="grow">
                            <span
                                class="text-sm sm:text-base text-gray-500 dark:text-neutral-500"
                            >
                                {@html article2}
                            </span>
                        </div>
                    </li>

                    <li class="flex gap-x-3">
                        <span
                            class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500"
                        >
                            <svg
                                class="shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><polyline points="20 6 9 17 4 12" /></svg
                            >
                        </span>
                        <div class="grow">
                            <span
                                class="text-sm sm:text-base text-gray-500 dark:text-neutral-500"
                            >
                                {@html article3}
                            </span>
                        </div>
                    </li>
                </ul>
                <!-- End List -->
            </div>
        </div>
        <!-- End Col -->
    </div>
    <!-- End Grid -->
</div>
<!-- End Features -->
