/* global process */

const SYSTEM_PROMPT = `You are a helpful health assistant for college students using curA, an evidence-based remedy app.

When a student describes symptoms:
1. Identify the likely symptoms from: headache, cold, anxiety, insomnia, nausea, stress, back pain, sore throat, eye strain, period cramps, fever, skin rash, ear pain, bloating, hangover, fatigue
2. Suggest 2-3 relevant remedies from our Natural, TCM, and Lifestyle categories
3. Always end with a disclaimer if symptoms sound serious
4. Keep responses SHORT - max 150 words
5. Format with bold headers and bullet points
6. Include navigation links in format: [View remedies →](/results?symptom=X)
7. Never diagnose. Never prescribe.
8. If the user describes an emergency (chest pain, difficulty breathing, severe injury) - immediately say to call emergency services.

Tone: warm, caring, like a knowledgeable friend. Not clinical. Not robotic.`;

const FALLBACK_REPLIES = [
  {
    patterns: ['chest pain', 'cant breathe', "can't breathe", 'difficulty breathing', 'severe injury', 'chest tightness', 'heart pain', 'stroke'],
    text: '**Emergency warning:**\n- Chest pain or trouble breathing can be urgent. Call emergency services now or ask someone nearby for immediate help.\n- Do not wait for home remedies.',
  },
  {
    patterns: ['blocked nose', 'stuffed nose', 'stuffy nose', 'congestion', 'nasal congestion', 'nose blocked'],
    text: '**For congestion:**\n- Steam Inhalation - loosens nasal mucus and soothes airways.\n- Saline Nasal Irrigation - clears nasal passages.\n- Tulsi Holy Basil Tea - supports immunity and clears congestion.\n\n[View remedies →](/results?q=congestion)\n\nIf congestion lasts more than 10 days or includes facial pain, check with a clinician.',
  },
  {
    patterns: ['cough', 'hacking cough', 'dry cough', 'chesty cough'],
    text: '**For cough:**\n- Honey Lemon Warm Tea - soothes throat and reduces cough.\n- Steam Inhalation - moistens irritated airways.\n- Eucalyptus Steam - helps loosen chest congestion.\n\n[View remedies →](/results?q=cough)\n\nSeek care if cough lasts more than 3 weeks or includes blood.',
  },
  {
    patterns: ['back', 'lower back', 'backache', 'back pain'],
    text: '**For back pain:**\n- Heat Therapy for Back Pain - eases tight lower-back muscles.\n- Cat-Cow Mobility Break - gentle movement after long sitting.\n\n[View remedies →](/results?q=back_pain)\n\nIf pain is severe, follows injury, or causes numbness, see a clinician.',
  },
  {
    patterns: ['sleep', 'insomnia', 'cant sleep', "can't sleep", 'sleepless', 'trouble sleeping'],
    text: '**For sleep trouble:**\n- Melatonin 1-3 mg - helpful for shifted sleep timing.\n- Stimulus Control Routine - retrains your bed for sleep.\n\n[View remedies →](/results?q=insomnia)\n\nIf this persists for weeks or affects safety, talk with a clinician.',
  },
  {
    patterns: ['nausea', 'nauseous', 'queasy', 'feel sick', 'vomit'],
    text: '**For nausea:**\n- Ginger Capsules - well-studied for mild nausea.\n- P6 Wrist Acupressure - quick, low-risk pressure-point support.\n\n[View remedies →](/results?q=nausea)\n\nSeek care for severe dehydration, blood, or persistent vomiting.',
  },
  {
    patterns: ['headache', 'migraine', 'head is pounding', 'head pain', 'tension head'],
    text: '**For headache:**\n- Peppermint Oil Roll-On - cooling relief for tension headaches.\n- Hydration Reset - useful after missed meals, heat, or caffeine.\n\n[View remedies →](/results?q=headache)\n\nIf sudden, severe, or lasting more than 48 hours, please see a doctor.',
  },
  {
    patterns: ['anxiety', 'anxious', 'panic', 'worried', 'nervous', 'racing thoughts', 'feeling anxious'],
    text: '**For anxiety:**\n- L-Theanine - calm focus without heavy sedation.\n- Guided Box Breathing - quick breathing pattern for rising stress.\n- Lavender Aromatherapy - immediate calming.\n\n[View remedies →](/results?q=anxiety)\n\nIf anxiety interferes with daily life, consider talking to a counselor.',
  },
  {
    patterns: ['stressed', 'stress', 'overwhelmed', 'burned out', 'tense', 'burnout'],
    text: '**For stress:**\n- Ten-Minute Outdoor Walk - interrupts stress spirals.\n- Lemon Balm Tea - calming option for study breaks.\n- Tai Chi Flow Session - movement with breathing.\n\n[View remedies →](/results?q=stress)\n\nIf stress feels unmanageable, reaching out to a professional can help.',
  },
  {
    patterns: ['brain fog', 'brainfog', 'cant focus', "can't focus", 'mental fog', 'foggy head', 'hard to concentrate'],
    text: '**For brain fog:**\n- Daylight Energy Walk - morning light improves alertness.\n- Hydration Reset - dehydration is a common cause of brain fog.\n- Protein Snack Reset - stabilizes energy.\n\n[View remedies →](/results?q=brain_fog)\n\nIf brain fog is persistent or accompanied by other symptoms, check with a doctor.',
  },
  {
    patterns: ['fatigue', 'tired', 'low energy', 'exhausted', 'drained'],
    text: '**For fatigue:**\n- Daylight Energy Walk - light and movement for alertness.\n- Strategic Power Nap - 20 minutes restores energy.\n- Protein Snack Reset - stable energy between meals.\n\n[View remedies →](/results?q=fatigue)\n\nIf fatigue lasts more than 2 weeks or disrupts daily life, see a clinician.',
  },
  {
    patterns: ['period cramps', 'menstrual pain', 'period pain', 'cramps', 'dysmenorrhea'],
    text: '**For period cramps:**\n- Heating Pad for Period Cramps - warmth relaxes uterine muscles.\n- Ginger for Menstrual Pain - natural prostaglandin reducer.\n- Gentle Yoga for Cramps - relaxes pelvic floor.\n\n[View remedies →](/results?q=period_cramps)\n\nIf cramps prevent daily activities, talk with a gynecologist.',
  },
  {
    patterns: ['sore throat', 'throat pain', 'scratchy throat', 'raw throat', 'hurts to swallow'],
    text: '**For sore throat:**\n- Salt Water Gargle - simple relief for irritation.\n- Honey Ginger Throat Tea - soothes and coats the throat.\n- Licorice Root Tea - anti-inflammatory demulcent.\n\n[View remedies →](/results?q=sore_throat)\n\nIf sore throat lasts more than a week or includes a rash, see a doctor.',
  },
  {
    patterns: ['eye strain', 'tired eyes', 'dry eyes', 'screen fatigue', 'strained eyes'],
    text: '**For eye strain:**\n- 20-20-20 Screen Reset - resets focusing muscles.\n- Warm Eye Compress - soothes tired eyelids.\n- Palming Technique - complete visual rest.\n\n[View remedies →](/results?q=eye_strain)\n\nIf eye pain, vision changes, or persistent dryness, see an eye doctor.',
  },
  {
    patterns: ['eye pain', 'eyes hurt', 'hurting eyes', 'pain in eyes'],
    text: '**For eye pain:**\n- Cold Spoon Compress - numbs pain and reduces inflammation.\n- Rose Water Eye Drops - cooling relief for tired eyes.\n- Acupressure for Eye Pain - pressure points around the eye.\n\n[View remedies →](/results?q=eye_pain)\n\nIf eye pain is severe or accompanied by vision changes, seek urgent care.',
  },
  {
    patterns: ['bloating', 'bloated', 'gassy', 'gas', 'distended'],
    text: '**For bloating:**\n- Peppermint Bloating Tea - relaxes GI muscles.\n- Post-Meal Walk - stimulates gut motility.\n- Fennel and Cumin Digestive Water - Ayurvedic carminative.\n\n[View remedies →](/results?q=bloating)\n\nIf bloating is persistent or painful, consult a gastroenterologist.',
  },
  {
    patterns: ['hangover', 'hungover'],
    text: '**For hangover:**\n- Hangover Hydration Reset - fluids and electrolytes.\n- Ginger Mint Recovery Tea - settles nausea.\n- Light Walking and Fresh Air - clears alcohol metabolites.\n\n[View remedies →](/results?q=hangover)\n\nIf confusion, repeated vomiting, or possible alcohol poisoning, seek emergency care.',
  },
  {
    patterns: ['fever', 'high temperature', 'high temp', 'running a temp', 'feeling feverish'],
    text: '**For fever:**\n- Fever Fluids and Rest Plan - rest, light clothing, steady fluids.\n- Tepid Cooling Cloth - gentle cooling without shock.\n- Giloy Juice - Ayurvedic immunity support.\n\n[View remedies →](/results?q=fever)\n\nFor very high fever, stiff neck, confusion, or trouble breathing, seek urgent care.',
  },
  {
    patterns: ['skin rash', 'rash', 'itchy skin', 'hives', 'skin irritation'],
    text: '**For skin rash:**\n- Cool Compress for Itchy Irritation - stops the itch-scratch cycle.\n- Oatmeal Bath for Skin Rash - soothes irritated skin.\n- Aloe Vera and Sandalwood Gel - cooling Ayurvedic relief.\n\n[View remedies →](/results?q=skin_rash)\n\nIf rash is spreading, infected, or with fever, see a doctor.',
  },
  {
    patterns: ['ear pain', 'earache', 'ear hurt', 'blocked ear'],
    text: '**For ear pain:**\n- Warm Compress for Ear Pain - eases pressure discomfort.\n- Neck and Jaw Release Stretches - relieves referred ear pain.\n- Garlic and Sesame Oil Drops - antimicrobial ear drops.\n\n[View remedies →](/results?q=ear_pain)\n\nFor drainage, fever, hearing loss, or severe pain, seek medical care.',
  },
  {
    patterns: ['leg pain', 'leg hurt', 'leg ache', 'leg cramp', 'shin splints', 'sore leg'],
    text: '**For leg pain:**\n- Rest, Ice, and Elevation Protocol - reduces inflammation.\n- Gentle Leg Stretching Routine - relieves muscle tightness.\n- Epsom Salt Soak - magnesium for muscle relaxation.\n\n[View remedies →](/results?q=leg_pain)\n\nIf calf is red, warm, or swollen, or you cannot bear weight, seek care.',
  },
  {
    patterns: ['knee pain', 'knee hurt', 'sore knee', 'pain in knee'],
    text: '**For knee pain:**\n- Knee Ice and Rest Therapy - reduces inflammation.\n- Quadriceps Strengthening Routine - stabilizes the patella.\n- Epsom Salt Knee Soak - magnesium for joint relaxation.\n\n[View remedies →](/results?q=knee_pain)\n\nIf knee locks, buckles, or cannot fully extend, see a practitioner.',
  },
  {
    patterns: ['neck pain', 'stiff neck', 'neck hurt', 'cervical pain'],
    text: '**For neck pain:**\n- Neck Stretching and Warmth Routine - gentle mobility.\n- Neck Support and Posture Reset - ergonomic adjustments.\n- Neck Rolls and Stretches - range-of-motion exercises.\n\n[View remedies →](/results?q=neck_pain)\n\nIf pain radiates down the arm or causes numbness, see a clinician.',
  },
  {
    patterns: ['shoulder pain', 'shoulder hurt', 'sore shoulder', 'frozen shoulder'],
    text: '**For shoulder pain:**\n- Shoulder Ice and Mobility Routine - ice and gentle movement.\n- Doorway Chest Stretch - opens chest and relieves forward shoulder.\n- Shoulder Rolls and Pendulums - maintains mobility.\n\n[View remedies →](/results?q=shoulder_pain)\n\nIf you cannot raise your arm or have weakness, seek care.',
  },
  {
    patterns: ['indigestion', 'upset stomach', 'dyspepsia', 'bad digestion'],
    text: '**For indigestion:**\n- Post-Meal Walk - stimulates digestion.\n- Fennel and Cumin Digestive Water - Ayurvedic digestive aid.\n- Ginger Capsules - supports gastric motility.\n\n[View remedies →](/results?q=indigestion)\n\nIf indigestion is persistent or with weight loss, consult a gastroenterologist.',
  },
  {
    patterns: ['heartburn', 'acid reflux', 'burning chest', 'gerd', 'reflux'],
    text: '**For heartburn:**\n- Posture awareness after meals - avoid lying down after eating.\n- Smaller meals - reduces abdominal pressure.\n- Ginger tea - mild digestive support.\n\n[View remedies →](/results?q=heartburn)\n\nIf heartburn is frequent or severe, see a doctor.',
  },
  {
    patterns: ['constipation', 'constipated', 'irregular bowels', 'hard stools'],
    text: '**For constipation:**\n- Hydration Reset - water softens stools.\n- Post-Meal Walk - stimulates bowel motility.\n- Gentle abdominal massage - stimulates peristalsis.\n\n[View remedies →](/results?q=constipation)\n\nIf constipation persists more than 3 weeks or with severe pain, see a clinician.',
  },
  {
    patterns: ['diarrhea', 'loose stools', 'diarrhoea', 'runny stools'],
    text: '**For diarrhea:**\n- Oral Rehydration Sips - prevent dehydration.\n- Small bland meals - give the gut a rest.\n- Ginger tea - settles the stomach.\n\n[View remedies →](/results?q=diarrhea)\n\nFor persistent vomiting, blood, or signs of dehydration, seek medical care.',
  },
  {
    patterns: ['stomach ache', 'stomach pain', 'belly ache', 'tummy ache'],
    text: '**For stomach ache:**\n- Peppermint Tea - settles the stomach.\n- Ginger Capsules - supports digestion.\n- Post-Meal Walk - stimulates gut motility.\n\n[View remedies →](/results?q=stomach_ache)\n\nFor severe or persistent pain, see a doctor.',
  },
  {
    patterns: ['dehydration', 'dehydrated', 'thirsty', 'dry mouth'],
    text: '**For dehydration:**\n- Oral Rehydration Sips - small, steady fluid replacement.\n- Electrolyte drink - replenishes minerals.\n- Water-rich foods - cucumber, watermelon, oranges.\n\n[View remedies →](/results?q=dehydration)\n\nFor severe dehydration with confusion or inability to keep fluids down, seek emergency care.',
  },
  {
    patterns: ['pms', 'premenstrual', 'pms symptoms'],
    text: '**For PMS:**\n- Heating Pad for Period Cramps - warmth for discomfort.\n- Ginger Capsules - supports menstrual comfort.\n- Gentle Yoga - relaxes pelvic muscles.\n\n[View remedies →](/results?q=pms)\n\nIf PMS symptoms severely impact daily life, talk with a gynecologist.',
  },
  {
    patterns: ['menopause', 'perimenopause', 'hot flashes', 'night sweats'],
    text: '**For menopause symptoms:**\n- Cooling layers and breathable bedding - manage hot flashes.\n- Stress reduction techniques - help with mood changes.\n- Consistent sleep schedule - supports hormonal balance.\n\n[View remedies →](/results?q=menopause)\n\nFor severe symptoms, consult with a healthcare provider.',
  },
  {
    patterns: ['dry skin', 'flaky skin', 'rough skin', 'chapped skin'],
    text: '**For dry skin:**\n- Coconut Oil Moisturizer - supports skin barrier.\n- Cool Compress - calms irritation.\n- Hydration Reset - skin needs water from inside.\n\n[View remedies →](/results?q=dry_skin)\n\nIf dry skin is severe or with cracking, see a dermatologist.',
  },
  {
    patterns: ['acne', 'breakout', 'pimples', 'spots', 'zits'],
    text: '**For acne:**\n- Neem and Turmeric Paste - Ayurvedic antimicrobial.\n- Aloe Vera Gel - cooling and soothing.\n- Gentle cleansing routine - avoid harsh scrubs.\n\n[View remedies →](/results?q=acne)\n\nFor severe or cystic acne, consult a dermatologist.',
  },
  {
    patterns: ['joint pain', 'joint ache', 'sore joints', 'arthritis pain'],
    text: '**For joint pain:**\n- Warm compress - increases blood flow.\n- Gentle range-of-motion exercises - maintain mobility.\n- Turmeric anti-inflammatory - natural support.\n\n[View remedies →](/results?q=joint_pain)\n\nIf joint is hot, red, or swollen, or pain is severe, see a clinician.',
  },
  {
    patterns: ['muscle pain', 'muscle ache', 'sore muscles', 'body ache', 'body pain'],
    text: '**For muscle pain:**\n- Epsom Salt Soak - magnesium for muscle relaxation.\n- Heat Therapy - increases blood flow.\n- Gentle stretching - maintains flexibility.\n\n[View remedies →](/results?q=muscle_pain)\n\nIf muscle pain follows injury or persists, check with a clinician.',
  },
];

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function fallbackReply(messages) {
  const text = messages.map((message) => message.content).join(' ').toLowerCase();
  return FALLBACK_REPLIES.find((reply) => reply.patterns.some((pattern) => text.includes(pattern)))?.text
    || '**A few options that may help:**\n- Try searching your main symptom in curA for evidence-based remedies.\n- If symptoms feel severe, unusual, or keep getting worse, check with a clinician.\n\n[View remedies →](/search)';
}

async function askClaude(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 280,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10).map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      })),
    }),
  });

  if (!response.ok) throw new Error(`Claude request failed with ${response.status}`);
  const payload = await response.json();
  return payload.content?.[0]?.text || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  try {
    const body = await parseBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) return json(res, 400, { error: 'Messages are required.' });

    let reply = null;
    try {
      reply = await askClaude(messages);
    } catch {
      reply = null;
    }

    return json(res, 200, { reply: reply || fallbackReply(messages) });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to answer right now.' });
  }
}
