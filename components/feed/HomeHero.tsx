import * as React from "react"
import { Button } from "@/components/ui/Button"

export function HomeHero() {
    return (
        <div className="w-full py-12 px-6 text-center border-b border-slate-50">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                Welcome to TaskBounty
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                The professional micro-task social network where expertise meets opportunity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto px-10">
                    Sign up to post tasks
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">
                    Learn more
                </Button>
            </div>
        </div>
    )
}
