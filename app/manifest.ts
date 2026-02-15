import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TaskBounty Marketplace',
        short_name: 'TaskBounty',
        description: 'Secure and transparent task marketplace with escrow protection.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon.png', // Needs to be added to public/
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png', // Needs to be added to public/
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
