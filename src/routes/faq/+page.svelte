<script lang="ts">
    let { data } = $props();
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
		  "@type": "FAQPage",
		  "name": "FAQ | PeerPort",
		  "operatingSystem": "Web",
		  "applicationCategory": "File Transfer Application",
		  "description": "PeerPort is a secure, peer-to-peer file sharing application powered by WebRTC. Share files instantly, privately and without servers.",
		  "keywords": "peer-to-peer file sharing, secure file transfer, private file sharing, encrypted file sharing",
		  "url": "https://peerport.netlify.app/faq",
		  "publisher": {
			"@type": "Organization",
			"name": "PeerPort",
			"url": "https://peerport.netlify.app/"
		  }
		}
	</script>
</svelte:head>

<!-- FAQ -->
<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Title -->
    <div class="max-w-2xl mx-auto mb-10 lg:mb-14">
        <h2
            class="text-slate-700 text-5xl font-black md:text-7xl md:leading-tight dark:text-white"
        >
            FAQ
        </h2>
        <p class="text-gray-500 mt-5">
            Welcome to our help center, where you'll find answers to the most
            common questions about transferring your files with PeerPort. We've
            also included tips and best practices to make your file transfers
            faster and more reliable.
        </p>
    </div>
    <!-- End Title -->

    <div
        class="max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-neutral-700"
    >
        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Why choose Peer-to-Peer for file sharing instead of
                        cloud-based solutions?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        Peer-to-peer (P2P) file sharing removes the need for a
                        centralized server, allowing files to travel directly
                        between users. Unlike cloud-based services, where your
                        files are uploaded, stored temporarily, and then
                        downloaded again (introducing size limits, bandwidth
                        restrictions, and potential privacy risks), P2P
                        transfers are faster, have no imposed size limitations
                        (besides device/browser capabilities), and protect your
                        data's confidentiality by bypassing third-party servers
                        entirely. This ensures faster speeds, greater control,
                        and true end-to-end privacy.
                    </p>
                </div>
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        How does this file sharing system work technically?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        Our application uses WebRTC to establish a direct,
                        encrypted connection between two users. A Python-based
                        signaling server facilitates the initial exchange of
                        connection details (SDP offers, ICE candidates), but it
                        never sees or handles your files. Once the connection is
                        made, files are transferred through a WebRTC
                        DataChannel, providing low-latency, secure peer-to-peer
                        communication without routing data through any central
                        server.
                    </p>
                </div>
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Are my files stored or cached on your servers?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        No. Our servers are only used for the initial signaling
                        phase to establish the WebRTC connection. They never
                        receive, cache, or store your files. Once the direct
                        connection between peers is established, all file data
                        flows exclusively between the sender and the receiver,
                        ensuring complete privacy.
                    </p>
                </div>
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        How is the file transfer secured?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        All file transfers are encrypted using WebRTC's built-in
                        security protocols, including DTLS (Datagram Transport
                        Layer Security) and SRTP (Secure Real-time Transport
                        Protocol). This ensures that all data sent over the
                        connection is protected against interception and
                        tampering. The encryption happens automatically at the
                        transport layer, providing end-to-end security without
                        any user intervention.
                    </p>
                </div>
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Is there any limit on the file size?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        There is no strict file size limit enforced by our
                        system. However, practical limits exist depending on
                        your device's memory capacity and browser constraints.
                        WebRTC holds the file chunks in memory during transfer,
                        so extremely large files (e.g., 2GB+) may cause
                        performance issues, especially on low-memory devices.
                        For large files, we recommend using a stable, high-speed
                        connection and modern hardware.
                    </p>
                </div>
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Do I need to install any applications or browser
                        extensions?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        No installation is required. Our platform works entirely
                        within your web browser using native WebRTC APIs. You
                        can send and receive files securely without needing any
                        plugins, third-party software, or browser extensions. It
                        works seamlessly on all major modern browsers.
                    </p>
                </div>
            </div>
        </div>
        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Is it safe to use this system over public Wi-Fi?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        Yes. WebRTC encrypts all data end-to-end, ensuring that
                        even on untrusted networks like public Wi-Fi, your file
                        transfers remain secure against eavesdropping. However,
                        public networks can introduce packet loss or connection
                        instability. It's recommended to verify your peer’s
                        identity if possible before transferring sensitive files
                        over open networks.
                    </p>
                </div>
            </div>
        </div>
        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <svg
                    class="shrink-0 mt-1 size-6 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="12" cy="12" r="10" /><path
                        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                    /><path d="M12 17h.01" /></svg
                >

                <div class="grow">
                    <h3
                        class="md:text-lg font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        How does the signaling server work?
                    </h3>
                    <p class="mt-1 text-gray-500 dark:text-neutral-500">
                        The signaling server, built with Python, acts as a
                        lightweight message relay. It transfers connection
                        information (SDP offers/answers, ICE candidates) between
                        peers to help them discover each other and establish a
                        direct WebRTC link. It does not store, process, or
                        analyze any of your actual file data. In fact, your
                        files aren't even sent to the servers; the server's only
                        task is to establish the connection between the two
                        people. Once the WebRTC connection is successfully
                        established, the signaling server connection is no
                        longer needed and is closed.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- End FAQ -->
