import Container from '@/components/shared/Container'

const TermsAndConditions = () => {
    return (
        <div className="py-12 bg-gray-950 min-h-screen">
            <Container>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-primary mb-3 font-bold tracking-[0.3em] text-[10px] uppercase">
                            <div className="w-5 h-[2px] bg-primary rounded-full" />
                            Legal Documentation
                        </div>
                        <h1 className="text-5xl font-black text-white mb-6">Terms of Service</h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Please read these terms carefully before using the PoseLab Studio platform.
                        </p>
                    </div>

                    <div className="space-y-12 text-gray-300 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using PoseLab (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                            <p>
                                PoseLab provides a 3D Minecraft skin posing and rendering studio. Users can upload skins, create poses, and export high-fidelity renders. We reserve the right to modify or terminate the Service for any reason, without notice at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
                            <p>
                                You are responsible for all activity that occurs under your account. You must not use the Service for any illegal or unauthorized purpose. In the use of the Service, you must not violate any laws in your jurisdiction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                            <p>
                                The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of PoseLab and its licensors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                            <p>
                                In no event shall PoseLab, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-500 italic">
                                Last updated: December 2025. Contact legal@poselab.gg for inquiries.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default TermsAndConditions
