export default function AdsInfoPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Ads Info</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Transparency about advertising on the TaskBounty platform.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Our Approach to Advertising</h2>
                    <p className="text-slate-600 mb-4">
                        Currently, TaskBounty does not display third-party advertisements on our platform.
                        Our revenue model is based on service fees from successful task completions, not on selling your attention to advertisers.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Sponsored Tasks</h2>
                    <p className="text-slate-600 mb-4">
                        Occasionally, you may see tasks that are "Featured" or "Sponsored".
                        These are tasks where the Poster has paid an additional fee to increase visibility.
                        These will always be clearly marked as such.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Changes to this Policy</h2>
                    <p className="text-slate-600 mb-4">
                        If our advertising policy changes in the future, we will update this page to reflect those changes and inform our users.
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
