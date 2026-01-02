# Bug Fix Template

> Use this template when reporting a bug that needs to be fixed.

---

## Instructions

1. Copy the template below
2. Fill in all sections with as much detail as possible
3. Include error messages, logs, or screenshots if available
4. Submit your request

---

## Template

```markdown
## Bug Fix: [Brief Bug Description]

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Problem

**What's happening:**
[Describe the current incorrect behavior]

**What should happen:**
[Describe the expected correct behavior]

### Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]
4. [Bug occurs]

### Environment

- Platform: [iOS / Android / Both]
- App version: [if known]
- Device: [if relevant]

### Error Messages / Logs (if available)
```

[Paste any error messages or relevant logs here]

```

### Files Likely Involved

- [file path 1]
- [file path 2]

### Screenshots (if applicable)

[Attach or describe screenshots]

---

## Constraints

- **Fix ONLY the bug** - do not refactor unrelated code
- **Minimal changes** - make the smallest change that fixes the issue
- **Preserve existing behavior** - don't change how other features work
- **Add logging** - use `logger.error` to help debug similar issues in the future

## Pre-Fix Checklist

Before fixing, you MUST:

1. [ ] Understand the root cause (not just the symptom)
2. [ ] Check `docs/guides/AI_FEATURE_GUIDE.md` for relevant patterns
3. [ ] Verify the fix doesn't break other functionality
4. [ ] Add appropriate error logging
5. [ ] Test the fix resolves the issue
```

---

## Example: Filled Template

```markdown
## Bug Fix: Ride card shows wrong departure time

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Problem

**What's happening:**
The ride card on the home screen displays the departure time in UTC instead of Costa Rica timezone. A ride scheduled for 10:00 AM shows as 4:00 PM.

**What should happen:**
The departure time should display in America/Costa_Rica timezone, showing 10:00 AM.

### Steps to Reproduce

1. Create a ride with departure time 10:00 AM
2. Go to the home screen
3. Look at the ride card
4. Time shows as 4:00 PM (6 hours ahead)

### Environment

- Platform: Both iOS and Android
- App version: 1.0.0
- Device: All devices

### Error Messages / Logs

No error messages - this is a display issue.

### Files Likely Involved

- `components/ride-card.tsx`
- `utils/format-date.ts`

### Screenshots

[Ride card showing 4:00 PM instead of 10:00 AM]

---

## Constraints

- **Fix ONLY the bug** - do not refactor unrelated code
- **Minimal changes** - make the smallest change that fixes the issue
- **Preserve existing behavior** - don't change how other features work
- **Add logging** - use `logger.error` to help debug similar issues in the future

## Pre-Fix Checklist

Before fixing, you MUST:

1. [ ] Understand the root cause (not just the symptom)
2. [ ] Check `docs/guides/AI_FEATURE_GUIDE.md` for relevant patterns
3. [ ] Verify the fix doesn't break other functionality
4. [ ] Add appropriate error logging
5. [ ] Test the fix resolves the issue
```

---

## Quick Version (Simple Bugs)

For obvious, straightforward bugs:

```markdown
**Bug**: [What's broken]

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Expected**: [What should happen]
**Actual**: [What's happening]

**Likely file**: [file path]

**Constraint**: Fix only this bug, no refactoring.
```

### Example:

```markdown
**Bug**: "Join Ride" button doesn't show loading state

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Expected**: Button should show spinner while API call is in progress
**Actual**: Button stays static, user can tap multiple times

**Likely file**: `app/ride/[id].tsx`

**Constraint**: Fix only this bug, no refactoring.
```

---

## Debugging Tips

Before submitting, try these:

1. **Check the logs** - Look for `logger.error` output in console
2. **Verify auth** - Is `useAuthStore.getState().token` present?
3. **Check network** - Is the API responding? What status code?
4. **Review types** - Are null/undefined cases handled?
5. **Test on both platforms** - Does it happen on iOS and Android?

See Section 11 (Debugging Guide) of `docs/guides/AI_FEATURE_GUIDE.md` for more tips.
