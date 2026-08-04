import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-ink mb-2">Terms of Service</h1>
      <p className="text-sm text-ink-muted mb-8">Last updated: August 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-ink leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using Remzy (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">2. Not Medical Advice</h2>
          <p className="font-medium">Remzy provides general educational information about health and wellness. It is NOT medical advice, diagnosis, or treatment.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Remzy cannot diagnose conditions, prescribe treatments, or replace a qualified healthcare provider</li>
            <li>Always consult a licensed physician or other qualified health professional for any medical concerns</li>
            <li>Never ignore professional medical advice or delay seeking treatment because of information on Remzy</li>
            <li>In case of emergency, call your local emergency number immediately (911 in the US, 112 in India/EU, 999 in the UK)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">3. Accuracy of Information</h2>
          <p>While we strive to provide accurate, evidence-based information, we make no guarantees about completeness, reliability, or suitability of any content. Health information evolves — what is considered best practice today may change. Always verify critical health information with a current medical professional.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">4. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for the accuracy of information you provide (allergies, conditions, etc.)</li>
            <li>You understand that personalized recommendations depend on the accuracy of your health profile</li>
            <li>You will not use the Service for any illegal or unauthorized purpose</li>
            <li>You will not attempt to access other users&apos; accounts or data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">5. Limitation of Liability</h2>
          <p className="font-medium">TO THE MAXIMUM EXTENT PERMITTED BY LAW, REMZY AND ITS CREATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Any adverse health outcomes resulting from use of information on Remzy</li>
            <li>Reliance on any remedy or recommendation provided through the Service</li>
            <li>Errors or omissions in content</li>
            <li>Unauthorized access to your data</li>
          </ul>
          <p className="mt-2">You use the Service entirely at your own risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">6. Third-Party Links</h2>
          <p>Remzy may link to external research papers, studies, or resources. We are not responsible for the content or accuracy of third-party sites.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">7. Account Termination</h2>
          <p>You may delete your account and all associated data at any time from your Profile page. We reserve the right to terminate accounts that violate these terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">8. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of Remzy after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">9. Governing Law</h2>
          <p>These terms are governed by applicable local laws. Any disputes shall be resolved in the appropriate courts of the applicable jurisdiction.</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-ink/5 text-center">
        <Link to="/" className="text-sm text-primary hover:underline">Return to Home</Link>
      </div>
    </div>
  );
}

export default TermsOfService;
