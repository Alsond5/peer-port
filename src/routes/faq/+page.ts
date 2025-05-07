import type { PageLoad } from './$types';

export const load: PageLoad = () => {
    return {
        meta: {
            title: "FAQ | PeerPort",
            description: "Find answers to frequently asked questions about PeerPort's secure, private, and serverless file sharing service powered by WebRTC.",
            canonicalUrl: "https://peerport.netlify.app/faq",
            og_title: "Frequently Asked Questions | PeerPort",
            og_description: "Got questions about secure peer-to-peer file sharing with PeerPort? Explore our FAQ to learn about encryption, privacy, and file transfers."
        }
    };
};