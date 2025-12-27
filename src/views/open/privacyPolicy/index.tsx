import Container from '@/components/shared/Container'

const PrivacyPolicy = () => {
    return (
        <div className="py-12 bg-gray-950 min-h-screen">
            <Container>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-primary mb-3 font-bold tracking-[0.3em] text-[10px] uppercase">
                            <div className="w-5 h-[2px] bg-primary rounded-full" />
                            Data Governance
                        </div>
                        <h1 className="text-5xl font-black text-white mb-6">Privacy Policy</h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Your security and privacy are at the core of our studio's design.
                        </p>
                    </div>

                    <div className="space-y-12 text-gray-300 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly to us when you create an account, upload skins, or communicate with us. This may include your username, email address, and the digital assets you upload to the studio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our Service. This includes facilitating 3D rendering, managing your account, and sending you technical notices or support messages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Data Retention</h2>
                            <p>
                                We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Cookie Policy</h2>
                            <p>
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Security</h2>
                            <p>
                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-500 italic">
                                Last updated: December 2025. Your identity is your asset.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PrivacyPolicy
