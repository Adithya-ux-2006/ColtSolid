-- 009: Symptom-specific remedy recommendation layer
-- Creates a scored, ranked mapping between symptoms and remedies
-- Replaces the raw remedy_symptoms junction with evidence-based recommendations

BEGIN;

CREATE TABLE IF NOT EXISTS public.symptom_remedies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symptom_id TEXT NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
    remedy_id TEXT NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
    evidence_score INTEGER NOT NULL DEFAULT 1 CHECK (evidence_score >= 1 AND evidence_score <= 10),
    priority_rank INTEGER NOT NULL DEFAULT 5 CHECK (priority_rank >= 1 AND priority_rank <= 10),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (symptom_id, remedy_id)
);

ALTER TABLE public.symptom_remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to symptom_remedies"
    ON public.symptom_remedies FOR SELECT USING (true);

-- Seed from existing remedy_symptoms with computed evidence scores and priority ranks
INSERT INTO public.symptom_remedies (symptom_id, remedy_id, evidence_score, priority_rank)
WITH paper_counts AS (
    SELECT remedy_id, COUNT(*) AS count
    FROM public.research_papers
    GROUP BY remedy_id
)
SELECT
    rs.symptom_id,
    rs.remedy_id,
    CASE
        WHEN pc.count >= 2 THEN 8
        WHEN pc.count = 1 THEN 5
        ELSE 3
    END AS evidence_score,
    CASE
        -- ===== HEADACHE =====
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h01' THEN 10
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h04' THEN 10
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h02' THEN 9
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h03' THEN 8
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_h05' THEN 8
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_n02' THEN 5
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_s05' THEN 5
        WHEN rs.symptom_id = 'headache' AND rs.remedy_id = 'rem_ho01' THEN 4

        -- ===== COLD =====
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c04' THEN 10
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c01' THEN 9
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c02' THEN 9
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c05' THEN 8
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_h04' THEN 7
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_fv01' THEN 7
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_c03' THEN 6
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_st01' THEN 6
        WHEN rs.symptom_id = 'cold' AND rs.remedy_id = 'rem_st02' THEN 6

        -- ===== ANXIETY =====
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a05' THEN 10
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a01' THEN 9
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a04' THEN 9
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a02' THEN 8
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_a03' THEN 8
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_i03' THEN 6
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_s01' THEN 6
        WHEN rs.symptom_id = 'anxiety' AND rs.remedy_id = 'rem_s03' THEN 7

        -- ===== INSOMNIA =====
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i05' THEN 10
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i01' THEN 9
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i04' THEN 8
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i02' THEN 7
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_i03' THEN 7
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_h02' THEN 6
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_s02' THEN 6
        WHEN rs.symptom_id = 'insomnia' AND rs.remedy_id = 'rem_s04' THEN 7

        -- ===== NAUSEA =====
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n01' THEN 10
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n04' THEN 10
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n03' THEN 9
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n05' THEN 9
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_n02' THEN 8
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_c05' THEN 6
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_h05' THEN 6
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_pc02' THEN 6
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_bg01' THEN 6
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_ho01' THEN 6
        WHEN rs.symptom_id = 'nausea' AND rs.remedy_id = 'rem_ho02' THEN 6

        -- ===== STRESS =====
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_a05' THEN 10
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s05' THEN 10
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s03' THEN 9
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_i05' THEN 9
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_a01' THEN 8
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_a02' THEN 8
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s01' THEN 7
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s02' THEN 7
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_s04' THEN 7
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_h01' THEN 5
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_h03' THEN 5
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_c03' THEN 5
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_bp01' THEN 5
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_ep02' THEN 5
        WHEN rs.symptom_id = 'stress' AND rs.remedy_id = 'rem_ft01' THEN 6

        -- ===== BACK PAIN =====
        WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp01' THEN 10
        WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp02' THEN 9
        WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp03' THEN 8
        WHEN rs.symptom_id = 'back_pain' AND rs.remedy_id = 'rem_bp01' AND rs.symptom_id = 'stress' THEN 5

        -- ===== SORE THROAT =====
        WHEN rs.symptom_id = 'sore_throat' AND rs.remedy_id = 'rem_st01' THEN 10
        WHEN rs.symptom_id = 'sore_throat' AND rs.remedy_id = 'rem_st02' THEN 9

        -- ===== EYE STRAIN =====
        WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es01' THEN 10
        WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es02' THEN 9
        WHEN rs.symptom_id = 'eye_strain' AND rs.remedy_id = 'rem_es01' AND rs.symptom_id = 'fatigue' THEN 6

        -- ===== PERIOD CRAMPS =====
        WHEN rs.symptom_id = 'period_cramps' AND rs.remedy_id = 'rem_pc01' THEN 10
        WHEN rs.symptom_id = 'period_cramps' AND rs.remedy_id = 'rem_pc02' THEN 9

        -- ===== FEVER =====
        WHEN rs.symptom_id = 'fever' AND rs.remedy_id = 'rem_fv01' THEN 10
        WHEN rs.symptom_id = 'fever' AND rs.remedy_id = 'rem_fv02' THEN 9

        -- ===== SKIN RASH =====
        WHEN rs.symptom_id = 'skin_rash' AND rs.remedy_id = 'rem_sr01' THEN 10
        WHEN rs.symptom_id = 'skin_rash' AND rs.remedy_id = 'rem_sr02' THEN 9

        -- ===== EAR PAIN =====
        WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep01' THEN 10
        WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep02' THEN 9
        WHEN rs.symptom_id = 'ear_pain' AND rs.remedy_id = 'rem_ep02' AND rs.symptom_id = 'stress' THEN 5

        -- ===== BLOATING =====
        WHEN rs.symptom_id = 'bloating' AND rs.remedy_id = 'rem_bg01' THEN 10
        WHEN rs.symptom_id = 'bloating' AND rs.remedy_id = 'rem_bg02' THEN 10

        -- ===== HANGOVER =====
        WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho01' THEN 10
        WHEN rs.symptom_id = 'hangover' AND rs.remedy_id = 'rem_ho02' THEN 8

        -- ===== FATIGUE =====
        WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft01' THEN 10
        WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ft02' THEN 9
        WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_es01' THEN 6
        WHEN rs.symptom_id = 'fatigue' AND rs.remedy_id = 'rem_ho01' THEN 5

        ELSE 5
    END AS priority_rank
FROM public.remedy_symptoms rs
LEFT JOIN paper_counts pc ON pc.remedy_id = rs.remedy_id
ON CONFLICT (symptom_id, remedy_id) DO NOTHING;

COMMIT;
