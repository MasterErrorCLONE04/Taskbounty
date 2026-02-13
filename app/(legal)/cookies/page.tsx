export default function CookiesPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Cookie Policy</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    TaskBounty uses cookies and similar technologies to help provide, protect, and improve the TaskBounty Platform.
                    This policy explains how and why we use these technologies and the choices you have.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">1. What are Cookies?</h2>
                    <p className="text-slate-600 mb-4">
                        Cookies are small text files that are stored on your device when you visit a website.
                        They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">2. How We Use Cookies</h2>
                    <p className="text-slate-600 mb-4">
                        We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li><strong>Authentication:</strong> To log you into TaskBounty and keep you logged in.</li>
                        <li><strong>Security:</strong> To protect your user account and our platform.</li>
                        <li><strong>Preferences:</strong> To remember your settings and preferences.</li>
                        <li><strong>Analytics:</strong> To understand how you use our platform and improve it.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Your Choices</h2>
                    <p className="text-slate-600 mb-4">
                        Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
                        However, this may prevent you from taking full advantage of the website.
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
