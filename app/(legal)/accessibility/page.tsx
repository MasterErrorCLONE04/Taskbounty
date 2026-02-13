export default function AccessibilityPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Accessibility Statement</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    TaskBounty is committed to ensuring digital accessibility for people with disabilities.
                    We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Conformance Status</h2>
                    <p className="text-slate-600 mb-4">
                        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities.
                        TaskBounty is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Feedback</h2>
                    <p className="text-slate-600 mb-4">
                        We welcome your feedback on the accessibility of TaskBounty. Please let us know if you encounter accessibility barriers on TaskBounty:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li>E-mail: accessibility@taskbounty.com</li>
                        <li>Postal Address: 123 Task Street, Tech City, TC 90210</li>
                    </ul>
                    <p className="text-slate-600">
                        We try to respond to feedback within 2 business days.
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
