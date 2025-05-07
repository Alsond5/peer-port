<script lang="ts">
    import FileTransfer from "$lib/components/FileTransfer.svelte";

    import Feature from "$lib/components/Feature.svelte";

    import PeerPortImage from "$lib/assets/peerport.png?enhanced";
    import img_private from "$lib/assets/private.svg";
    import img_connection from "$lib/assets/connection.svg";
    import img_questions from "$lib/assets/questions.svg";

    import security_img from "$lib/assets/mascot/security.png?enhanced";
    import no_server_img from "$lib/assets/mascot/no_server.png?enhanced";
    import unlimited_img from "$lib/assets/mascot/unlimited.png?enhanced";
    import support_img from "$lib/assets/mascot/support.png?enhanced";

    let { data } = $props();

    const brands = import.meta.glob("/src/lib/assets/brands/*.svg", {
        eager: true,
        query: "?url",
        import: "default",
    });
</script>

<svelte:head>
    <title>{data.meta.title}</title>
    <meta name="description" content={data.meta.description}>

    <link rel="canonical" href={data.meta.canonicalUrl} />
    
    <meta property="og:title" content={data.meta.og_title} />
    <meta property="og:description" content={data.meta.og_description} />
    <meta property="og:url" content={data.meta.og_url} />
    <meta property="og:type" content={data.meta.og_type} />
    <meta property="og:image" content={data.meta.og_image} />

    <script type="application/ld+json">
		{
		  "@context": "https://schema.org",
		  "@type": "SoftwareApplication",
		  "name": "PeerPort",
		  "operatingSystem": "Web",
		  "applicationCategory": "File Transfer Application",
		  "description": "PeerPort is a secure, peer-to-peer file sharing application powered by WebRTC. Share files instantly, privately and without servers.",
		  "keywords": "peer-to-peer file sharing, secure file transfer, private file sharing, encrypted file sharing",
		  "url": "https://peerport.netlify.app/",
		  "publisher": {
			"@type": "Organization",
			"name": "PeerPort",
			"url": "https://peerport.netlify.app/"
		  }
		}
	</script>
</svelte:head>

<!-- Announcement Banner -->
<div class="max-w-[90rem] w-full my-3 px-4 sm:px-6 lg:px-8 mx-auto">
    <div
        class="bg-blue-600 bg-[url('/src/lib/assets/abstract_bg.svg')] bg-no-repeat bg-cover bg-center p-4 rounded-lg text-center"
    >
        <div class="flex flex-wrap justify-center items-center gap-2">
            <p class="inline-block text-white">PeerPort is open source.</p>
            <a
                class="py-1.5 px-2.5 md:py-2 md:px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border-2 border-white text-white hover:border-white/70 hover:text-white/70 focus:outline-hidden focus:border-white/70 focus:text-white/70 disabled:opacity-50 disabled:pointer-events-none"
                href="https://github.com/Alsond5/peer-port"
            >
                GitHub
                <svg
                    class="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                >
            </a>
        </div>
    </div>
</div>
<!-- End Announcement Banner -->

<!-- Hero -->
<div
    class="relative overflow-hidden before:absolute before:top-20 before:start-1/2 before:bg-[url('/src/lib/assets/hero_bg.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-1 before:transform before:-translate-x-1/2"
>
    <div
        class="flex items-center max-w-[90rem] lg:h-[43rem] mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
        <!-- Grid -->
        <div
            class="grid lg:grid-cols-7 mx-auto lg:gap-x-8 xl:gap-x-12 lg:items-center"
        >
            <div class="text-center lg:text-left lg:col-span-4 lg:pr-12">
                <h1
                    class="block text-4xl font-black text-slate-700 md:text-5xl lg:text-6xl dark:text-white"
                >
                    Secure platform to share your files
                </h1>
                <p
                    class="text-md lg:text-xl mt-3 text-gray-500 dark:text-neutral-400"
                >
                    Share your files with the assurance of peer-to-peer
                    transfer, backed by end-to-end encryption for complete
                    security
                </p>
            </div>
            <!-- End Col -->

            <div class="lg:col-span-3 mt-10 lg:mt-0">
                <FileTransfer />
            </div>
            <!-- End Col -->
        </div>
        <!-- End Grid -->
    </div>
</div>
<!-- End Hero -->

<!-- Clients -->
<div class="max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Title -->
    <div class="w-2/3 sm:w-1/2 lg:w-1/3 mx-auto text-center mb-6">
        <h2 class="text-gray-600 dark:text-neutral-400">Credits</h2>
    </div>
    <!-- End Title -->

    <div class="flex justify-center gap-x-6 sm:gap-x-12 lg:gap-x-24">
        {#each Object.entries(brands) as [path, url]}
            <img
                class="py-3 lg:py-5 w-16 h-auto md:w-20 lg:w-24 mx-auto sm:mx-0"
                src={url as string}
                alt={path.split("/").at(-1)?.split(".").at(0)}
            />
        {/each}
    </div>
</div>
<!-- End Clients -->

<div class="max-w-[70rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <h2 class="text-center text-3xl md:text-6xl text-slate-800 font-black">
        The best place to share your files securely
    </h2>
</div>

<Feature
    position="left"
    image_url={img_private}
    title="We make secure file sharing effortless"
    text="Besides focusing on privacy-first communication, PeerPort enables seamless, encrypted file transfers directly between peers without storing data on any server."
    article1="End-to-end encrypted connections"
    article2="Fast & reliable peer-to-peer transfers"
    article3="No servers, no storage, pure privacy"
/>

<Feature
    position="right"
    image_url={img_connection}
    title="Built for modern collaboration needs"
    text="PeerPort empowers teams and individuals to share important files instantly without worrying about size limits, intermediaries, or data breaches."
    article1="Unlimited file size support"
    article2="Drag & drop file sharing"
    article3="Direct peer connections, no middlemen"
/>

<Feature
    position="left"
    image_url={img_questions}
    title="Do you still have questions?"
    text="PeerPort makes it simple and secure, but if you’re curious about how we protect your files or ensure stability, we’re always here to help."
    article1="Check out our <a href='/faq' class='text-blue-500'>frequently asked questions</a>"
    article2="Also you can <a href='/contact' class='text-blue-500'>contact us</a> for any questions"
    article3="If you want you can <a href='/donate' class='text-blue-500'>buy us a coffee ☕!</a>"
/>

<!-- Card Blog -->
<div class="max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Title -->
    <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2
            class="text-3xl font-extrabold md:text-6xl md:leading-tight dark:text-white"
        >
            Why use PeerPort?
        </h2>
        <p class="mt-3 text-gray-600 dark:text-neutral-400">
            End-to-end encryption, peer-to-peer connection and unlimited
            sharing. We have integrated all these features and many more into
            one single platform for you.
        </p>
    </div>
    <!-- End Title -->

    <!-- Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card -->
        <a
            class="feature relative group bg-gray-50 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-xl p-5 transition dark:hover:bg-white/10 dark:focus:bg-white/10"
            href="/features#security"
        >
            <div class="aspect-w-16 aspect-h-10 p-13">
                <enhanced:img
                    class="w-full object-cover rounded-xl"
                    src={security_img}
                    alt="Security"
                />
            </div>
            <h3
                class="mt-5 text-xl text-gray-800 dark:text-neutral-300 dark:hover:text-white"
            >
                Your files are sent end-to-end encrypted directly to the
                recipient.
            </h3>
            <p
                class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200"
            >
                Learn more
                <svg
                    class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                >
            </p>
        </a>
        <!-- End Card -->

        <!-- Card -->
        <a
            class="feature relative group bg-gray-50 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-xl p-5 transition dark:hover:bg-white/10 dark:focus:bg-white/10"
            href="/features#serverless"
        >
            <div class="aspect-w-16 aspect-h-10 p-13">
                <enhanced:img
                    class="w-full object-cover rounded-xl"
                    src={no_server_img}
                    alt="No Server"
                />
            </div>
            <h3
                class="mt-5 text-xl text-gray-800 dark:text-neutral-300 dark:hover:text-white"
            >
                There is no server that monitors or stores your files.
            </h3>
            <p
                class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200"
            >
                Learn more
                <svg
                    class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                >
            </p>
        </a>
        <!-- End Card -->

        <!-- Card -->
        <a
            class="feature relative group bg-gray-50 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 rounded-xl p-5 transition dark:hover:bg-white/10 dark:focus:bg-white/10"
            href="/features#unlimited"
        >
            <div class="aspect-w-16 aspect-h-10 p-13">
                <enhanced:img
                    class="w-full object-cover rounded-xl"
                    src={unlimited_img}
                    alt="Unlimited"
                />
            </div>
            <h3
                class="mt-5 text-xl text-gray-800 dark:text-neutral-300 dark:hover:text-white"
            >
                There is no file size limit. The limit is only your device.
            </h3>
            <p
                class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200"
            >
                Learn more
                <svg
                    class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                >
            </p>
        </a>
        <!-- End Card -->
    </div>
    <!-- End Grid -->
</div>
<!-- End Card Blog -->

<!-- Icon Blocks -->
<div class="max-w-[90rem] px-4 py-10 mt-15 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div class="max-w-2xl mx-auto">
        <!-- Grid -->
        <div class="grid gap-12">
            <div>
                <h2
                    class="text-center text-3xl text-slate-800 font-black md:text-6xl dark:text-white"
                >
                    What is PeerPort?
                </h2>
                <p class="mt-3 text-gray-800 dark:text-neutral-400">
                    PeerPort is a peer-to-peer file sharing platform powered by
                    WebRTC technology. It allows you to send files of any size
                    directly from your device to others, without ever uploading
                    them to a server.
                </p>
                <enhanced:img
                    class="rounded-xl my-8"
                    src={PeerPortImage}
                    alt="PeerPort working logic"
                />
                <p class="mt-3 text-gray-800 dark:text-neutral-400">
                    By creating a secure, encrypted connection between devices,
                    PeerPort ensures that your data stays private, fast, and
                    truly yours. No storage, no tracking, no limits — just pure,
                    seamless sharing.
                </p>
            </div>

            <div class="space-y-6 lg:space-y-10">
                <!-- Icon Block -->
                <div class="flex gap-x-5 sm:gap-x-8">
                    <svg
                        class="shrink-0 fill-blue-500 mt-2 size-6 text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                    >
                        <path
                            d="m5.5,7c1.93,0,3.5-1.57,3.5-3.5S7.43,0,5.5,0s-3.5,1.57-3.5,3.5,1.57,3.5,3.5,3.5Zm0-5c.827,0,1.5.673,1.5,1.5s-.673,1.5-1.5,1.5-1.5-.673-1.5-1.5.673-1.5,1.5-1.5Zm12,15c2.481,0,4.5-2.019,4.5-4.5s-2.019-4.5-4.5-4.5-4.5,2.019-4.5,4.5,2.019,4.5,4.5,4.5Zm0-7c1.379,0,2.5,1.121,2.5,2.5s-1.121,2.5-2.5,2.5-2.5-1.121-2.5-2.5,1.121-2.5,2.5-2.5Zm-9.067,8.607c.76.762.76,2.023-.013,2.798l-2.199,2.288c-.196.204-.458.307-.721.307-.25,0-.499-.093-.693-.279-.398-.383-.411-1.016-.028-1.414l1.256-1.307h-2.035c-2.206,0-4-1.794-4-4v-1c0-.553.448-1,1-1s1,.447,1,1v1c0,1.103.897,2,2,2h2.029l-1.25-1.307c-.383-.398-.371-1.031.028-1.414.398-.382,1.031-.371,1.414.027l2.212,2.301Zm14.85,5.352c-.095.028-.189.041-.282.041-.433,0-.831-.282-.959-.718-.568-1.933-2.436-3.282-4.541-3.282s-3.973,1.35-4.541,3.282c-.156.529-.71.836-1.242.677-.53-.155-.833-.711-.677-1.241.817-2.777,3.473-4.718,6.459-4.718s5.643,1.94,6.459,4.718c.156.53-.147,1.086-.677,1.241Zm-12.931-11.022c-.116.043-.234.063-.351.063-.405,0-.786-.247-.937-.649-.527-1.406-1.959-2.351-3.563-2.351s-3.037.944-3.563,2.351c-.194.519-.771.777-1.288.586-.517-.194-.779-.771-.585-1.287.818-2.183,3.003-3.649,5.437-3.649s4.618,1.467,5.437,3.649c.194.517-.068,1.093-.585,1.287Z"
                        />
                    </svg>
                    <div class="grow">
                        <h3
                            class="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                        >
                            Direct and seamless sharing
                        </h3>
                        <p class="mt-1 text-gray-600 dark:text-neutral-400">
                            PeerPort is purpose-built for peer-to-peer
                            communication, designed to make sharing files feel
                            as natural and effortless as handing something to a
                            friend. Powered by WebRTC, your data flows directly
                            — fast, secure, and without storage in between.
                        </p>
                    </div>
                </div>
                <!-- End Icon Block -->

                <!-- Icon Block -->
                <div class="flex gap-x-5 sm:gap-x-8">
                    <svg
                        class="shrink-0 mt-2 fill-blue-500 size-6 text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        ><path
                            d="M2.5,2.5C2.5,1.12,3.62,0,5,0s2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5-2.5-1.12-2.5-2.5ZM7,15h-3c-1.1,0-2-.9-2-2v-3c0-1.1,.9-2,2-2,.55,0,1-.45,1-1s-.45-1-1-1C1.79,6,0,7.79,0,10v3c0,1.48,.81,2.77,2,3.46v6.54c0,.55,.45,1,1,1s1-.45,1-1v-6h2v6c0,.55,.45,1,1,1s1-.45,1-1v-7c0-.55-.45-1-1-1ZM19,5c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5-2.5,1.12-2.5,2.5,1.12,2.5,2.5,2.5Zm1,1c-.55,0-1,.45-1,1s.45,1,1,1c1.1,0,2,.9,2,2v3c0,1.1-.9,2-2,2h-3c-.55,0-1,.45-1,1v7c0,.55,.45,1,1,1s1-.45,1-1v-6h2v6c0,.55,.45,1,1,1s1-.45,1-1v-6.54c1.19-.69,2-1.99,2-3.46v-3c0-2.21-1.79-4-4-4Zm-2.87,1.91l-1.61-1.61c-.39-.39-1.02-.39-1.41,0-.39,.39-.39,1.02,0,1.41l1.29,1.29h-6.8l1.29-1.29c.39-.39,.39-1.02,0-1.41-.39-.39-1.02-.39-1.41,0l-1.61,1.61c-1.15,1.15-1.15,3.03,0,4.19l1.61,1.61c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41l-1.29-1.29h6.8l-1.29,1.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l1.61-1.61c1.15-1.15,1.15-3.03,0-4.19Z"
                        /></svg
                    >

                    <div class="grow">
                        <h3
                            class="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                        >
                            Connecting people, not servers
                        </h3>
                        <p class="mt-1 text-gray-600 dark:text-neutral-400">
                            Our passion is real connection. PeerPort brings
                            devices — and people — together, creating a digital
                            community where sharing is instant, private, and
                            truly yours. No middlemen. No servers. Just pure
                            peer-to-peer exchange.
                        </p>
                    </div>
                </div>
                <!-- End Icon Block -->

                <!-- Icon Block -->
                <div class="flex gap-x-5 sm:gap-x-8">
                    <svg
                        class="shrink-0 fill-blue-500 mt-2 size-6 text-gray-800 dark:text-white"
                        id="Layer_1"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        width="24"
                        height="24"
                        ><path
                            d="m21.944 11.377-2.501-.829c-.607-.201-1.278-.201-1.888 0l-2.5.829c-1.229.407-2.056 1.552-2.056 2.848v3.208c.056 2.532 1.753 4.668 5.047 6.347.26.133.565.145.834.034 3.339-1.375 5.061-3.522 5.119-6.403v-3.187c0-1.296-.826-2.44-2.056-2.848zm.056 6.014c-.038 1.906-1.17 3.345-3.457 4.39-2.347-1.283-3.507-2.722-3.543-4.37v-3.187c0-.432.275-.813.685-.949l2.499-.829c.203-.067.427-.067.63 0l2.5.829c.41.136.685.517.685.949v3.167zm-9.029 5.751c.084-.32-.093-.653-.304-.887-.035-.031-2.375-2.163-3.894-5.255h1.227c.552 0 1-.448 1-1s-.448-1-1-1h-2.03c-.291-.952-.47-1.96-.47-3s.18-2.047.472-3h8.772s.002 0 .003 0h.003 4.784c.029.091.063.18.089.272.149.536.717.841 1.234.69.532-.15.841-.703.69-1.234-1.446-5.12-6.166-8.699-11.488-8.726-6.63-.034-12.063 5.359-12.059 11.998 0 6.616 5.383 12 11.999 12 .479.002.927-.381.972-.858zm-7.068-8.142h-3.442c-.299-.948-.461-1.955-.461-3s.162-2.052.461-3h3.442c-.246.956-.403 1.958-.403 3s.157 2.044.403 3zm6.099-12.587c.814.861 2.205 2.5 3.229 4.587h-6.453c1.025-2.083 2.412-3.725 3.224-4.587zm8.659 4.587h-3.236c-.79-1.881-1.881-3.479-2.821-4.647 2.544.691 4.735 2.366 6.058 4.647zm-11.272-4.642c-.94 1.167-2.024 2.767-2.811 4.642h-3.225c1.308-2.253 3.466-3.945 6.036-4.642zm-6.036 14.642h3.225c.787 1.875 1.87 3.475 2.811 4.642-2.57-.697-4.728-2.389-6.036-4.642z"
                        /></svg
                    >
                    <div class="grow">
                        <h3
                            class="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                        >
                            Simple, secure and hassle-free
                        </h3>
                        <p class="mt-1 text-gray-600 dark:text-neutral-400">
                            We take care of the hard parts so you can focus on
                            what matters. With instant connections, end-to-end
                            encryption, and no storage worries, PeerPort makes
                            sending and receiving files as easy as starting a
                            conversation.
                        </p>
                    </div>
                </div>
                <!-- End Icon Block -->
            </div>
        </div>
        <!-- End Grid -->
    </div>
</div>
<!-- End Icon Blocks -->

<!-- Subscribe -->
<div class="max-w-[90rem] w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-16 mx-auto">
    <div class="grid md:grid-cols-2 gap-8">
        <div class="flex items-center max-w-xs md:max-w-sm mx-auto lg:ml-0 lg:w-2/3 aspect-2/3 p-13">
            <enhanced:img
                class="w-full object-cover rounded-xl"
                src={support_img}
                alt="Support"
            />
        </div>

        <form class="flex items-center">
            <div class="w-full">
                <div>
                    <h1
                        class="block text-3xl font-black text-slate-800 sm:text-4xl lg:text-6xl dark:text-white"
                    >
                        Support <span class="text-blue-500">PeerPort</span>
                    </h1>
                    <p class="mt-3 text-lg text-gray-800 dark:text-neutral-400">
                        PeerPort is a nonprofit built for you. No ads, no
                        trackers, no surveillance. Donating to PeerPort helps
                        pay for project expenses. Thank you for your support!
                    </p>

                    <!-- Buttons -->
                    <div class="mt-7 grid gap-3 w-full sm:inline-flex">
                        <a
                            class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            href="/donate"
                        >
                            Donate
                            <svg
                                class="shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path d="m9 18 6-6-6-6" /></svg
                            >
                        </a>
                    </div>
                    <!-- End Buttons -->
                </div>
            </div>
        </form>
    </div>
</div>
<!-- End Subscribe -->

<style>
    .feature::before {
        content: " ";
        position: absolute;
        bottom: 60%;
        left: 0px;
        top: 0px;
        width: 100%;
        background: linear-gradient(180deg, #ffffff, transparent 70%);
    }
</style>