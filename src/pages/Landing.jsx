import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Heart } from 'lucide-react';
import { FAQAccordion, Modal } from '../components/ui';
import { QuestionnaireFlow } from '../components/onboarding/QuestionnaireFlow';
import { PageWrapper } from '../components/layout';
import { FAQ_ITEMS } from '../constants/onboarding';
import { saveGuestProfile } from '../utils/guestProfile';

export function Landing() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  return (
    <PageWrapper className="min-h-screen bg-cream flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center px-6 py-24 max-w-2xl mx-auto w-full">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="text-2xl font-bold text-ink">ClotSolid</span>
          <span className="w-2 h-2 rounded-full bg-coral" />
        </div>

        <h1 className="text-display font-bold text-ink mb-4 tracking-tight">
          Research-backed relief
          <br />
          for when you need it most.
        </h1>

        <p className="text-lg text-ink-muted mb-8 max-w-lg leading-relaxed">
          Evidence-based remedies for common student health concerns.
          No sign-up needed to search.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 bg-coral text-white rounded-2xl px-8 py-4 font-semibold text-lg hover:bg-coral-dark transition-colors shadow-coral"
          >
            Start Your Search
          </Link>
          <button
            type="button"
            onClick={() => setIsQuestionnaireOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white text-ink rounded-2xl px-8 py-4 font-medium text-lg shadow-soft hover:shadow-card transition-shadow"
          >
            Quick Health Profile
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-6">
          <span className="flex items-center gap-1.5 text-sm text-ink-muted">
            <Shield className="w-4 h-4 text-teal" /> Free to use
          </span>
          <span className="flex items-center gap-1.5 text-sm text-ink-muted">
            <BookOpen className="w-4 h-4 text-teal" /> Research-backed
          </span>
          <span className="flex items-center gap-1.5 text-sm text-ink-muted">
            <Heart className="w-4 h-4 text-teal" /> Built for students
          </span>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-2xl mx-auto w-full">
        <h2 className="section-heading text-center">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8 mt-8">
          <Step
            number="1"
            title="Search"
            description="Type any symptom you're experiencing."
          />
          <Step
            number="2"
            title="Review"
            description="See evidence-backed remedies matched to your symptoms."
          />
          <Step
            number="3"
            title="Feel Better"
            description="Follow safe, research-supported guidance."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-heading text-center">Frequently Asked Questions</h2>
          <div className="mt-8">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-ink/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="font-bold text-ink">ClotSolid</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
          </div>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Not a substitute for professional medical advice. &copy; 2026 ClotSolid.
          </p>
        </div>
      </footer>

      <Modal isOpen={isQuestionnaireOpen} onClose={() => setIsQuestionnaireOpen(false)} title="Quick Health Profile">
        <QuestionnaireFlow
          compact
          completeMessage="Your search is ready."
          initialValues={{}}
          onSubmit={async ({ gender, commonConditions, knownAllergies }) => {
            saveGuestProfile({
              gender,
              common_conditions: commonConditions,
              known_allergies: knownAllergies,
            });
            return { success: true };
          }}
          onComplete={() => {
            setIsQuestionnaireOpen(false);
          }}
        />
      </Modal>
    </PageWrapper>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
    </div>
  );
}
