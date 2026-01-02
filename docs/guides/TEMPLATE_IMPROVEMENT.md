# Improvement Template

> Use this template for code improvements, refactoring, performance optimizations, or UX enhancements.

---

## Instructions

1. Copy the template below
2. Clearly define the scope (what to change AND what NOT to change)
3. Explain the benefit of the improvement
4. Submit your request

---

## Template

```markdown
## Improvement: [Brief Description]

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Type

- [ ] Performance optimization
- [ ] Code refactoring
- [ ] UX enhancement
- [ ] Technical debt cleanup
- [ ] Accessibility improvement
- [ ] Other: [specify]

### Current State

[Describe how things work currently. What's the problem or limitation?]

### Desired State

[Describe how things should work after the improvement. What's the benefit?]

### Scope

**What to change:**
- [File/component 1]
- [File/component 2]

**What NOT to change:**
- [File/component that should stay the same]
- [Behavior that must be preserved]

### Impact

**Performance**: [None / Minor / Significant improvement expected]
**UX**: [None / Minor / Significant improvement expected]
**Code Quality**: [None / Minor / Significant improvement expected]

### Risk Assessment

**Risk Level**: [Low / Medium / High]
**Reason**: [Why this risk level]
**Mitigation**: [How to reduce risk]

---

## Pre-Implementation Checklist

Before implementing, you MUST:

1. [ ] Read `docs/guides/AI_FEATURE_GUIDE.md` - especially Section 2 (Code Philosophy)
2. [ ] Verify the improvement is worth the change (avoid over-engineering)
3. [ ] Ensure changes don't break existing functionality
4. [ ] Keep the solution as SIMPLE as possible
5. [ ] Follow existing patterns in the codebase

## Reminders

- Don't add unnecessary abstractions
- Don't refactor code outside the defined scope
- Self-documenting code - no comments unless necessary
- Test on both iOS and Android
```

---

## Example: Filled Template

```markdown
## Improvement: Optimize rides list loading performance

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Type

- [x] Performance optimization
- [ ] Code refactoring
- [x] UX enhancement
- [ ] Technical debt cleanup
- [ ] Accessibility improvement
- [ ] Other

### Current State

The rides list fetches all rides on every screen focus, even if data was fetched recently. This causes:
- Unnecessary API calls
- Brief loading flicker on every tab switch
- Wasted bandwidth

### Desired State

Implement a simple cache strategy:
- Don't refetch if data is less than 30 seconds old
- Still allow pull-to-refresh to force update
- Show cached data immediately, update in background if stale

### Scope

**What to change:**
- `components/rides-list.tsx` - add cache logic

**What NOT to change:**
- `services/api/rides.ts` - API layer stays the same
- Pull-to-refresh behavior - must still work
- Initial load behavior - first load always fetches

### Impact

**Performance**: Significant - reduces API calls by ~80% during normal use
**UX**: Minor - eliminates loading flicker on tab switches
**Code Quality**: Minor - adds small amount of cache logic

### Risk Assessment

**Risk Level**: Low
**Reason**: Change is isolated to one component, doesn't affect API layer
**Mitigation**: Keep pull-to-refresh as escape hatch if cache becomes stale

---

## Pre-Implementation Checklist

Before implementing, you MUST:

1. [ ] Read `docs/guides/AI_FEATURE_GUIDE.md` - especially Section 2 (Code Philosophy)
2. [ ] Verify the improvement is worth the change (avoid over-engineering)
3. [ ] Ensure changes don't break existing functionality
4. [ ] Keep the solution as SIMPLE as possible
5. [ ] Follow existing patterns in the codebase

## Reminders

- Don't add unnecessary abstractions
- Don't refactor code outside the defined scope
- Self-documenting code - no comments unless necessary
- Test on both iOS and Android
```

---

## Quick Version (Simple Improvements)

For minor, focused improvements:

```markdown
**Improvement**: [What to improve]

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Current**: [How it works now]
**Desired**: [How it should work]

**Scope**: [File(s) to change]
**Don't touch**: [File(s) to leave alone]

**Keep it simple**: Minimal changes only.
```

### Example:

```markdown
**Improvement**: Add loading indicator to chat send button

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Current**: Send button stays static while message is being sent
**Desired**: Button shows spinner during API call, disabled to prevent double-send

**Scope**: `app/chats/[chatId].tsx`
**Don't touch**: `services/api/chats.ts`, message bubble styling

**Keep it simple**: Use existing ActionButton component pattern.
```

---

## Types of Improvements

### Performance Optimization
- Reduce API calls
- Optimize re-renders
- Lazy loading
- Caching strategies

### Code Refactoring
- Extract reusable components
- Simplify complex functions
- Remove duplicate code
- Improve naming

### UX Enhancement
- Better loading states
- Improved error messages
- Smoother animations
- Clearer feedback

### Technical Debt Cleanup
- Update deprecated dependencies
- Fix TypeScript warnings
- Remove dead code
- Standardize patterns

---

## Warning Signs (When NOT to Improve)

Stop and reconsider if:

- The improvement is "nice to have" but not solving a real problem
- You're adding abstraction "for future flexibility"
- The change affects many files (high risk)
- Existing code works fine, you just prefer different style
- You're gold-plating when you should ship

Remember: **Simplicity > Elegance**

See Section 2 (Code Philosophy) of `docs/guides/AI_FEATURE_GUIDE.md` for guidance.

