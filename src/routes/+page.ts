import type { PageLoad } from './$types';

export const load: PageLoad = () => {
    return {
        meta: {
            title: "Share files privately | PeerPort",
            description: "Transfer files securely and privately with WebRTC-powered end-to-end encrypted peer-to-peer sharing. Fast, safe, and serverless — your files stay in your control.",
            canonicalUrl: "https://peerport.netlify.app/",
            og_title: "Secure Peer-to-Peer File Sharing | PeerPort",
            og_description: "Share files instantly with secure, end-to-end encrypted peer-to-peer transfers powered by WebRTC. Fast, private, and serverless.",

        }
    };
};