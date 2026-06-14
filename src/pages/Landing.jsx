import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, GraduationCap } from 'lucide-react';
import { SymptomChip } from '../components/ui';
import { PageWrapper } from '../components/layout';
import { useCatalogStore } from '../store/catalogStore';

export function Landing() {
  const symptoms = useCatalogStore((state) => state.symptoms);

  return (
    <PageWrapper className="min-h-screen bg-snow flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-light/20 to-sage-light/20 -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 mx-auto bg-forest rounded-2xl flex items-center justify-center shadow-forest mb-8">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-ink tracking-tight">
            Research-backed symptom relief for students.
          </h1>
          
          <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Evidence-based natural and conventional remedies — curated by medical researchers, built for college life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-forest text-white rounded-full font-bold text-lg hover:bg-forest-dark transition-all shadow-forest hover:shadow-lg transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-sage-dark border-2 border-sage rounded-full font-bold text-lg hover:bg-sage/5 transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Symptom Strip */}
      <section className="py-8 border-y border-gray-100 bg-white shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-4">Common Symptoms</p>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 snap-x">
            {symptoms.map(symptom => (
              <Link key={symptom.id} to="/login" className="snap-start">
                <SymptomChip symptom={symptom} isSelected={false} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-snow flex-grow">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
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

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-forest flex items-center justify-center text-white font-bold text-xs">C</div>
          <span className="font-bold text-ink">ClotSolid</span>
        </div>
        <p className="text-sm text-ink-muted">© 2026 ClotSolid. Not a substitute for professional medical advice.</p>
      </footer>
    </PageWrapper>
  );
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto bg-sage/10 rounded-2xl flex items-center justify-center mb-6 text-sage-dark">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-ink mb-3">{title}</h3>
      <p className="text-ink-muted leading-relaxed">{description}</p>
    </div>
  );
}
