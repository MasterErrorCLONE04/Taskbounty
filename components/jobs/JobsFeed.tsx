"use client"

import { useEffect, useState } from "react"
import { JobCard, JobBounty } from "@/components/jobs/JobCard"
import { JobsHeader } from "@/components/jobs/JobsHeader"
import { JobsSearch } from "@/components/jobs/JobsSearch"
import { JobsFilters } from "@/components/jobs/JobsFilters"
import { getTasks } from "@/actions/tasks"

export function JobsFeed() {
    const [jobs, setJobs] = useState<JobBounty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [category, setCategory] = useState('All')

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            try {
                const data = await getTasks({ search: searchQuery, category })
                setJobs(data as any)
            } catch (error) {
                console.error('Failed to fetch jobs:', error)
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchJobs, 300) // Debounce search
        return () => clearTimeout(timer)
    }, [searchQuery, category])

    return (
        <div className="flex flex-col min-h-full pb-20">
            <JobsHeader />
            <JobsSearch value={searchQuery} onChange={setSearchQuery} />
            <JobsFilters activeCategory={category} onCategoryChange={setCategory} />

            <div className="flex flex-col">
                {isLoading ? (
                    <div className="flex justify-center p-10">
                        <span className="text-slate-400 font-medium">Loading bounites...</span>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                        <p className="font-bold text-lg">No bounties found</p>
                        <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    )
}
