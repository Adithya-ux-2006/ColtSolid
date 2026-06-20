import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, GraduationCap, Search, ArrowRight } from 'lucide-react';
import { FAQAccordion, Modal, DisplayCardsRow } from '../components/ui';
import { QuestionnaireFlow } from '../components/onboarding/QuestionnaireFlow';
import { PageWrapper } from '../components/layout';
import { useCatalogStore } from '../store/catalogStore';
import { FAQ_ITEMS } from '../constants/onboarding';
import { saveGuestProfile } from '../utils/guestProfile';
import { trackSearchEvent } from '../utils/analytics';

export function Landing() {
  const symptoms = useCatalogStore((state) => state.symptoms);
  const navigate = useNavigate();
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  const quickSymptoms = useMemo(
    () => symptoms.filter((s) => ['headache', 'cold', 'anxiety', 'insomnia', 'nausea', 'stress'].includes(s.id)).slice(0, 6),
    [symptoms]
  );

  return (
    <PageWrapper className="min-h-screen bg-gradient-hero flex flex-col">
      <section className="relative pt-24 pb-16 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-14 h-14 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl font-bold text-white">C</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-ink tracking-tight">
            Research-backed relief
            <br />
            <span className="text-primary">for students.</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            No sign up needed. Search your symptoms and find evidence-backed remedies instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsQuestionnaireOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-glow hover:shadow-lg"
            >
              Get Started
            </button>
            <Link
              to="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-ink rounded-2xl font-medium text-lg shadow-soft hover:shadow-card transition-all"
            >
              Start Your Search <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm font-medium text-ink-muted flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> Free to use
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> Research-backed
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> Built for students
            </span>
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3">
          <StatCard value="30+" label="Remedies" />
          <StatCard value="4" label="Remedy Types" />
          <StatCard value="60+" label="Research Papers" />
        </div>
      </section>

      {quickSymptoms.length > 0 && (
        <section className="py-6 border-y border-ink/5 bg-white/50">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">
              Common Symptoms
            </p>
            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-6 px-6 snap-x">
              {quickSymptoms.map((symptom) => (
                <Link
                  key={symptom.id}
                  to={`/results?symptom=${symptom.id}`}
                  className="snap-start shrink-0"
                  onClick={() => trackSearchEvent({ source: 'landing_chip', symptomIds: [symptom.id] }).catch(() => {})}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft hover:shadow-card transition-shadow text-sm font-medium text-ink border border-ink/5 whitespace-nowrap">
                    <span className="text-lg">{symptom.emoji}</span>
                    {symptom.label}
                  </span>
                </Link>
              ))}
              <Link
                to="/search"
                className="snap-start shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium border border-primary/20 whitespace-nowrap hover:bg-primary/10 transition-colors"
              >
                <Search className="w-4 h-4" />
                View all
              </Link>
            </div>
          </div>
        </section>
      )}

      <DisplayCardsRow />

      <section className="py-20 flex-1">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              icon={ShieldCheck}
              title="Evidence-Backed"
              description="Every remedy is supported by clinical research. No pseudoscience, just proven results."
            />
            <Feature
              icon={Stethoscope}
              title="4 Treatment Approaches"
              description="Filter by Natural, Traditional Chinese Medicine, Conventional, or Lifestyle remedies."
            />
            <Feature
              icon={GraduationCap}
              title="Built for Students"
              description="Cost-effective, accessible, and fast-acting solutions designed for busy academic schedules."
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-heading font-semibold text-ink">Frequently Asked Questions</h2>
          <p className="mt-2 text-ink-muted">
            Everything you need to know before your first search.
          </p>
          <div className="mt-8 text-left">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-ink/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs">C</div>
          <span className="font-bold text-ink">ClotSolid</span>
        </div>
        <p className="text-xs text-ink-subtle">&copy; 2026 ClotSolid. Not a substitute for professional medical advice.</p>
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
            navigate('/search');
          }}
        />
      </Modal>
    </PageWrapper>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-card">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto bg-accent/20 rounded-2xl flex items-center justify-center mb-5 text-primary">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-ink mb-3">{title}</h3>
      <p className="text-ink-muted leading-relaxed">{description}</p>
    </div>
  );
}
