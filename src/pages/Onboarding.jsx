import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { QuestionnaireFlow } from '../components/onboarding/QuestionnaireFlow';
import { useAuthStore } from '../store/authStore';

export function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const saveOnboarding = useAuthStore((state) => state.saveOnboarding);

  return (
    <PageWrapper className="min-h-screen bg-[#F7F1E7] px-6 py-8 md:py-12">
      <QuestionnaireFlow
        initialValues={user}
        onSubmit={saveOnboarding}
        onComplete={() => navigate('/dashboard', { replace: true })}
      />
    </PageWrapper>
  );
}
