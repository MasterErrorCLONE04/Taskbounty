export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    At TaskBounty, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website or use our mobile application.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Information We Collect</h2>
                    <p className="text-slate-600 mb-4">
                        We collect information that you provide directly to us when you register for an account, update your profile, post a task, or communicate with us. This may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li>Personal identification information (Name, email address, phone number).</li>
                        <li>Payment information (Credit card details, bank account information).</li>
                        <li>Profile information (Skills, bio, photo).</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">2. How We Use Your Information</h2>
                    <p className="text-slate-600 mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li>Facilitate the creation of and secure your account.</li>
                        <li>Process transactions and send you related information.</li>
                        <li>Match tasks with suitable Taskers.</li>
                        <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Sharing Your Information</h2>
                    <p className="text-slate-600 mb-4">
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing and data analysis.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Security of Your Information</h2>
                    <p className="text-slate-600 mb-4">
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Contact Us</h2>
                    <p className="text-slate-600">
                        If you have questions or comments about this Privacy Policy, please contact us at privacy@taskbounty.com.
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}
