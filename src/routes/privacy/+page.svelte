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
		  "@type": "LegalService",
		  "name": "Privacy | PeerPort",
		  "operatingSystem": "Web",
		  "applicationCategory": "File Transfer Application",
		  "description": "PeerPort is a secure, peer-to-peer file sharing application powered by WebRTC. Share files instantly, privately and without servers.",
		  "keywords": "peer-to-peer file sharing, secure file transfer, private file sharing, encrypted file sharing",
		  "url": "https://peerport.netlify.app/privacy",
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
            Privacy
        </h2>

        <div class="flex flex-col mt-10 gap-5">
            <p class="sm:text-lg text-gray-500">We don’t store your data. Ever.</p>
            <p class="sm:text-lg text-gray-500">
                PeerPort operates without collecting or storing any personal
                data or file content. We do not log your IP address, metadata,
                file names, transfer sizes, or any other sensitive information.
                There are no hidden analytics, trackers, or databases behind the
                scenes.
            </p>
            <p class="sm:text-lg text-gray-500">
                At the moment, we do not keep any usage statistics either. This
                means there is no record of how many transfers happen daily or
                any fallback mechanisms being triggered — we focus purely on
                providing a seamless and private peer-to-peer file sharing
                experience.
            </p>
            <p class="sm:text-lg text-gray-500">
                PeerPort is fully compliant with GDPR (General Data Protection
                Regulation) and similar global privacy standards. Since no data
                is collected or stored, your right to privacy is inherently
                respected by design.
            </p>
            <p class="sm:text-lg text-gray-500">
                However, while we design the system to be as secure as possible,
                ultimate security also depends on user behavior. Share links and
                session connections are meant to be private — please treat them
                accordingly and only share them with trusted parties.
            </p>
            <p class="sm:text-lg text-gray-500">
                If you have any concerns, questions, or suggestions regarding
                privacy or security, feel free to reach out to us directly.
            </p>
            <p class="sm:text-lg text-gray-500">
                Privacy is not an add-on at PeerPort — it's the foundation.
            </p>
        </div>
    </div>
    <!-- End Title -->
</div>
<!-- End FAQ -->
