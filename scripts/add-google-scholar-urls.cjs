// Script to add Google Scholar search URLs to remedies
// Run with: node scripts/add-google-scholar-urls.cjs

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'remedies.js');

function addGoogleScholarUrls() {
  const content = fs.readFileSync(filePath, 'utf8');

  // For each remedy, add a Google Scholar search URL if it doesn't have enough research
  // The Google Scholar search URL format: https://scholar.google.com/scholar?q=<query>
  
  // We'll add a new field `googleScholarUrl` to each remedy object
  // This will be placed after isPurchasable (or after childSafetyNote if present)

  let updatedContent = content;
  let updatedCount = 0;

  // Find all remedy objects and add googleScholarUrl
  const remedyRegex = /\{[\s\S]*?id:\s*['"]([^'"]+)['"],[\s\S]*?\n\s*\}/g;
  
  // Process each remedy object
  const lines = content.split('\n');
  let inRemedy = false;
  let currentRemedy = null;
  let remedyStartLine = -1;
  let hasResearchPapers = false;
  let hasResearchLinks = false;
  let childSafeLine = -1;
  let isPurchasableLine = -1;
  let remedyEndLine = -1;
  
  const outputLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line starts a new remedy object
    if (trimmed.startsWith('{') && !inRemedy) {
      inRemedy = true;
      currentRemedy = null;
      hasResearchPapers = false;
      hasResearchLinks = false;
      childSafeLine = -1;
      isPurchasableLine = -1;
      remedyStartLine = i;
    }
    
    if (inRemedy) {
      // Check for id
      if (trimmed.startsWith('id:')) {
        const match = trimmed.match(/id:\s*['"]([^'"]+)['"]/);
        if (match) {
          currentRemedy = match[1];
        }
      }
      
      // Check for researchPapers
      if (trimmed.includes('researchPapers:')) {
        hasResearchPapers = true;
      }
      
      // Check for researchLinks
      if (trimmed.includes('researchLinks:')) {
        hasResearchLinks = true;
      }
      
      // Check for childSafe line
      if (trimmed.includes('childSafe:')) {
        childSafeLine = i;
      }
      
      // Check for isPurchasable line
      if (trimmed.includes('isPurchasable:')) {
        isPurchasableLine = i;
      }
      
      // Check for end of remedy object (closing brace at start of line with proper indentation)
      if (trimmed === '},' || trimmed === '}') {
        inRemedy = false;
        remedyEndLine = i;
        
        // Determine where to insert googleScholarUrl
        // Priority: after childSafe/childSafetyNote, else after isPurchasable
        let insertLine = childSafeLine > -1 ? childSafeLine : isPurchasableLine;
        
        if (insertLine > -1) {
          // Find the line after the selected line (where comma ends)
          let actualInsertLine = insertLine;
          for (let j = insertLine; j <= remedyEndLine; j++) {
            if (lines[j].includes(',')) {
              actualInsertLine = j;
              break;
            }
          }
          
          // Only add if remedy doesn't have enough research
          const totalResearch = (hasResearchPapers ? 1 : 0) + (hasResearchLinks ? 1 : 0);
          if (totalResearch < 3 && currentRemedy) {
            const query = encodeURIComponent(currentRemedy.replace(/-/g, ' ').replace(/_/g, ' ') + ' remedy clinical study');
            const googleScholarUrl = `https://scholar.google.com/scholar?q=${query}`;
            
            // Insert after the actual insert line
            lines.splice(actualInsertLine + 1, 0, `      googleScholarUrl: '${googleScholarUrl}',`);
            updatedCount++;
            console.log(`Added Google Scholar URL to ${currentRemedy}`);
          }
        }
      }
    }
    
    outputLines.push(line);
  }
  
  // Write the updated content
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`\nDone! Added Google Scholar URLs to ${updatedCount} remedies.`);
}

try {
  addGoogleScholarUrls();
} catch (e) {
  console.error('Error:', e);
}