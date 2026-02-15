import React from 'react';

const JsonLd = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taskbounty.vercel.app';

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TaskBounty',
        url: baseUrl,
        logo: `${baseUrl}/icon-512.png`,
        sameAs: [
            'https://twitter.com/taskbounty',
            'https://facebook.com/taskbounty',
            'https://instagram.com/taskbounty'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-555-5555',
            contactType: 'customer service',
            areaServed: 'Worldwide',
            availableLanguage: ['English', 'Spanish']
        }
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TaskBounty',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/jobs?search={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </section>
    );
};

export default JsonLd;
