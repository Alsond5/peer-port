import type { PageLoad } from './$types';

export const load: PageLoad = () => {
    return {
        meta: {
            title: "Privacy Policy | PeerPort",
            description: "Learn how PeerPort protects your privacy and ensures secure file transfers. We respect your data and never store your files or personal information.",
            canonicalUrl: "https://peerport.netlify.app/policy",
            og_title: "Privacy Policy | PeerPort",
            og_description: "Understand how PeerPort handles your data. Our privacy policy explains how we ensure secure, encrypted, and private peer-to-peer file sharing."
        }
    };
};