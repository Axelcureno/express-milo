# MWPW-181326 - 350px Min-Width Fix Reference

## 🎯 Current Task
Fix 350px min-width constraint issue in how-to-v2 block

## 📋 Context
- **Branch:** `MWPW-181326` (created from stage)
- **Issue:** 350px min-width constraint causing problems
- **Root cause:** Added by you in commit `b8f4caef` on August 2, 2025
- **Commit message:** "table and mobile styles update"

## 🔍 Key Findings

### 350px Constraint Locations
**File:** `express/code/blocks/how-to-v2/how-to-v2.css`

**Lines with 350px min-width:**
1. **Line 86:** `.how-to-v2 .milo-video, .how-to-v2 picture img`
2. **Line 116:** `.how-to-v2 .steps-content` 
3. **Line 128:** `.how-to-v2 .steps-content .media-container`
4. **Line 116:** `.how-to-v2 ol.steps`

### Original Purpose
- Added for tablet/mobile responsive design
- Ensures minimum width for proper display
- Part of mobile/tablet cleanup commit

## 🛠️ Next Steps

### 1. Switch to Main Repo
```bash
cd /Users/cano/Adobe/express-milo
git checkout MWPW-181326
aem up
```

### 2. Analyze the Issue
- Review current 350px constraints
- Identify which ones are problematic
- Determine what needs to be changed

### 3. Files to Focus On
- `express/code/blocks/how-to-v2/how-to-v2.css` - Main CSS file
- `express/code/blocks/how-to-v2/how-to-v2.js` - Check if JS needs updates

## 📊 Test Coverage Status
- **Jest/Web Test Runner:** 70% block coverage (67/96 blocks)
- **Script coverage:** 6% (46/49 files missing tests) 
- **Nala:** 72% block coverage (13/18 blocks)
- **Coverage report:** `test-coverage-report.md` (stashed)

## 🔧 Git Commands
```bash
# Switch to main repo
cd /Users/cano/Adobe/express-milo

# Checkout the branch
git checkout MWPW-181326

# Start AEM server
aem up

# Check current status
git status
```

## 📝 Notes
- Working directory was stashed clean
- All analysis files are in git stash
- Focus on the 4 specific 350px constraints
- Consider responsive design implications

---
*Generated for context switching between Cursor windows*

