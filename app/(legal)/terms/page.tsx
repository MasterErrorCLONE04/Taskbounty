export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Terms of Service</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Welcome to TaskBounty. By accessing or using our platform, you agree to be bound by these Terms of Service.
                    TaskBounty connects users who need tasks completed ("Posters") with users who want to complete tasks ("Taskers").
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 mb-4">
                        By registering for and/or using the Service in any manner, you agree to these Terms of Service and all other operating rules, policies, and procedures that may be published from time to time on the Site by us, each of which is incorporated by reference and each of which may be updated from time to time without notice to you.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Description of Service</h2>
                    <p className="text-slate-600 mb-4">
                        TaskBounty provides a platform for Posters to post tasks and for Taskers to accept and complete those tasks.
                        We act as an escrow agent to ensure that payments are held securely until the task is completed to the Poster's satisfaction.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">3. User Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li>You must be at least 18 years old to use this Service.</li>
                        <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                        <li>You agree to provide accurate, current, and complete information during the registration process.</li>
                        <li>You agree not to use the Service for any illegal or unauthorized purpose.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Payments and Escrow</h2>
                    <p className="text-slate-600 mb-4">
                        When a Tasker accepts a task, the agreed-upon bounty amount is held in escrow by TaskBounty.
                        Funds are released to the Tasker only upon successful completion and verification of the task by the Poster.
                        TaskBounty charges a service fee on each completed transaction.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Termination</h2>
                    <p className="text-slate-600 mb-4">
                        We may terminate your access to all or any part of the Service at any time, with or without cause, with or without notice, effective immediately.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Contact Us</h2>
                    <p className="text-slate-600">
                        If you have any questions about these Terms, please contact us at support@taskbounty.com.
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
