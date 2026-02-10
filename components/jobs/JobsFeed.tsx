
"use client"

import { JobCard, JobBounty } from "@/components/jobs/JobCard"
import { JobsHeader } from "@/components/jobs/JobsHeader"
import { JobsSearch } from "@/components/jobs/JobsSearch"
import { JobsFilters } from "@/components/jobs/JobsFilters"

export function JobsFeed() {
    const jobBounties: JobBounty[] = [
        {
            id: 'jb1',
            title: 'Fix: Redux State Hydration Bug',
            author: 'Marcus Chen',
            role: 'Senior Architect @ TechFlow',
            rating: 4.9,
            description: 'Looking for a React developer to help debug a complex state management issue with Redux Toolkit and Persist. Need immediate help. Experience with Next.js SSR is a plus.',
            tags: ['#ReactJS', '#Redux', '#TypeScript', '#Debugging'],
            amount: 120,
            currency: 'USDC',
            timeEst: '2 Hours Est.',
            avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=random'
        },
        {
            id: 'jb2',
            title: 'Figma Landing Page for FinTech App',
            author: 'Sarah Johnson',
            role: 'Design Director @ PixelPerfect',
            rating: 5.0,
            description: 'Urgent: Need 5 high-fidelity mockups for a landing page redesign. Assets and branding guidelines provided. Clean, modern, professional aesthetic required.',
            tags: ['#UIUX', '#Figma', '#LandingPage', '#FinTech'],
            amount: 450,
            currency: 'USDC',
            timeEst: '48 Hours',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
        },
        {
            id: 'jb3',
            title: 'Solidity Smart Contract Audit',
            author: 'Leo V.',
            role: 'CTO @ Web3Foundry',
            rating: 4.8,
            description: 'Security review for an ERC-721 staking contract. Looking for experienced auditors who can provide a detailed report on potential vulnerabilities.',
            tags: ['#Solidity', '#Web3', '#Security', '#SmartContracts'],
            amount: 1200,
            currency: 'USDC',
            timeEst: '3 Days',
            avatar: 'https://ui-avatars.com/api/?name=Leo+V&background=random'
        }
    ]

    return (
        <div className="flex flex-col min-h-full pb-20">
            <JobsHeader />
            <JobsSearch />
            <JobsFilters />

            <div className="flex flex-col">
                {jobBounties.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    )
}
