export function getInitials(name = '') {
  const initials = name
    .split(' ')
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .join('')
    .toUpperCase();

  return initials || 'U';
}

export function mapRemedy(remedy) {
  if (!remedy) return null;

  const symptomItems = remedy.remedy_symptoms || [];
  const allSymptoms = symptomItems.map((item) => item.symptom_id);
  const primarySymptoms = symptomItems
    .filter((item) => !item.match_strength || item.match_strength === 'primary')
    .map((item) => item.symptom_id);
  const secondarySymptoms = symptomItems
    .filter((item) => item.match_strength === 'secondary')
    .map((item) => item.symptom_id);

  return {
    id: remedy.id,
    name: remedy.name,
    category: remedy.category,
    symptoms: allSymptoms.length > 0 ? allSymptoms : (remedy.symptoms || []),
    primarySymptoms: primarySymptoms.length > 0 ? primarySymptoms : (allSymptoms.length > 0 ? allSymptoms : (remedy.symptoms || [])),
    secondarySymptoms: secondarySymptoms.length > 0 ? secondarySymptoms : [],
    rating: remedy.rating,
    reviewCount: remedy.review_count ?? remedy.reviewCount,
    shortDescription: remedy.short_description ?? remedy.shortDescription,
    longDescription: remedy.long_description ?? remedy.longDescription,
    howToUse: remedy.how_to_use ?? remedy.howToUse,
    warnings: remedy.warnings,
    allergen_tags: remedy.allergen_tags ?? remedy.allergenTags ?? [],
    contraindications: remedy.contraindications ?? [],
    ingredients: remedy.ingredients ?? [],
    timeToEffect: remedy.time_to_effect ?? remedy.timeToEffect,
    difficulty: remedy.difficulty,
    cost: remedy.cost,
    isFeatured: remedy.is_featured ?? remedy.isFeatured ?? false,
    researchPapers: remedy.research_papers?.map((paper) => ({
      title: paper.title,
      journal: paper.journal,
      url: paper.url,
      keyFinding: paper.key_findings ?? paper.key_finding ?? paper.keyFinding,
    })) || remedy.researchPapers || [],
    researchLinks: remedy.researchLinks || [],
  };
}

export function mapAppointment(appointment) {
  if (!appointment) return null;

  return {
    ...appointment,
    date: appointment.apt_date ?? appointment.date,
    time: appointment.apt_time ?? appointment.time,
  };
}
