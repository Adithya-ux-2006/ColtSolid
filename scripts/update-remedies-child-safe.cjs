// Script to add childSafe and childSafetyNote fields to local remedies data
// Run with: node scripts/update-remedies-child-safe.cjs

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'remedies.js');

// Child safety data matching migration 041
const CHILD_SAFE_DATA = {
  // true with general note
  'rem_001': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_004': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_007': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_016': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_019': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_021': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_022': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_023': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_034': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_040': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_041': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_044': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_045': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_101': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_103': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_104': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_105': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },
  'rem_106': { childSafe: true, childSafetyNote: 'Generally safe for children when used as directed. Consult pediatrician for children under 2.' },

  // true with pediatrician guidance note
  'rem_006': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_009': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_011': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_026': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_028': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_030': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_033': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_035': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_036': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_037': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },
  'rem_039': { childSafe: true, childSafetyNote: 'Safe for children with appropriate pediatric dosing. Consult pediatrician before use.' },

  // false - not for children
  'rem_h04': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_008': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_010': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_012': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_013': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_014': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_015': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_017': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_018': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_020': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_024': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_025': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_027': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_029': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_031': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_032': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_038': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_102': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_104': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
  'rem_105': { childSafe: false, childSafetyNote: 'Not recommended for children without clinician guidance.' },
};

function updateRemediesFile() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'remedies.js');
  let content = fs.readFileSync(filePath, 'utf8');

  // Process each remedy
  Object.entries(CHILD_SAFE_DATA).forEach(([id, data]) => {
    // Find the start of this remedy object
    const idIndex = content.indexOf(`id: '${id}'`);
    if (idIndex === -1) {
      console.log(`NOT FOUND: ${id}`);
      return;
    }

    // Find the isPurchasable line after this id
    const searchStart = idIndex;
    const isPurchasableIndex = content.indexOf('isPurchasable:', searchStart);
    if (isPurchasableIndex === -1) {
      console.log(`isPurchasable not found for ${id}`);
      return;
    }

    // Find the end of the isPurchasable line (the comma after true/false)
    const lineEndIndex = content.indexOf(',', isPurchasableIndex);
    if (lineEndIndex === -1) {
      console.log(`Line end not found for ${id}`);
      return;
    }

    // Insert after the comma
    const insertIndex = lineEndIndex + 1;
    const insertion = `\n      childSafe: ${data.childSafe},\n      childSafetyNote: '${data.childSafetyNote}',`;
    
    content = content.slice(0, insertIndex) + insertion + content.slice(insertIndex);
    console.log(`Updated ${id}`);
  });

  fs.writeFileSync(filePath, content);
  console.log('Done updating remedies.js');
}

try {
  updateRemediesFile();
  console.log('Done updating remedies.js');
} catch (e) {
  console.error('Error:', e);
}