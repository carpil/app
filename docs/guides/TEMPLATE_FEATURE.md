# Feature Request Template

> Use this template when requesting a new feature for Carpil.

---

## Instructions

1. Copy the template below
2. Fill in all sections
3. Delete any optional sections you don't need
4. Submit your request

---

## Template

```markdown
## Feature Request: [Feature Name]

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Description

[Clear, concise description of what the feature should do. Focus on the user outcome, not technical implementation.]

### User Story

As a [driver/passenger], I want to [action] so that [benefit/value].

### Requirements

- [ ] [Requirement 1 - what must happen]
- [ ] [Requirement 2 - what must happen]
- [ ] [Requirement 3 - what must happen]

### Acceptance Criteria

- [ ] [Criterion 1 - how to verify it works]
- [ ] [Criterion 2 - how to verify it works]
- [ ] [Criterion 3 - how to verify it works]

### UI/UX Notes (optional)

- [Any specific UI requirements]
- [Spanish text needed]
- [Loading/error states]

### Technical Notes (optional)

- API endpoint: [if known]
- Related files: [if known]
- Dependencies: [if any]

---

## Pre-Implementation Checklist

Before implementing, you MUST:

1. [ ] Read and understand `docs/guides/AI_FEATURE_GUIDE.md`
2. [ ] Find the SIMPLEST solution that solves the problem
3. [ ] Check for similar patterns in the codebase
4. [ ] Use self-documenting code (no comments unless necessary)
5. [ ] Complete the Quality Checklist (Section 8 of the guide)

## Reminders

- All UI text must be in Spanish (Costa Rica market)
- Use existing patterns from the codebase
- Follow the code philosophy: simplicity, self-documenting, no code smells
- Log key actions with `logger.info/error`
```

---

## Example: Filled Template

```markdown
## Feature Request: Ride Cancellation

**Reference Guide**: Follow all patterns and standards from `docs/guides/AI_FEATURE_GUIDE.md`

### Description

Allow drivers to cancel a ride they created before it starts. When cancelled, all passengers should be notified and the ride should no longer appear in the active rides list.

### User Story

As a driver, I want to cancel my ride so that passengers are notified and can find alternative transportation.

### Requirements

- [ ] Driver can cancel from the ride detail screen
- [ ] Show confirmation alert before cancellation
- [ ] Call API to cancel the ride
- [ ] Navigate back to home after successful cancellation
- [ ] Show error message if cancellation fails
- [ ] Passengers receive push notification about cancellation

### Acceptance Criteria

- [ ] Cancel button only visible to the driver (not passengers)
- [ ] Cancel button only visible for rides that haven't started
- [ ] After cancellation, ride status changes to "canceled"
- [ ] Ride disappears from the active rides list
- [ ] All passengers see notification within 30 seconds

### UI/UX Notes

- Cancel button should be red/warning color
- Confirmation dialog: "¿Estás seguro de cancelar este viaje?"
- Success message: "Viaje cancelado exitosamente"
- Error message: "No se pudo cancelar el viaje"

### Technical Notes

- API endpoint: POST /rides/{id}/cancel
- Firestore will update ride status for real-time sync
- Related files: `app/ride/[id].tsx`, `services/api/rides.ts`

---

## Pre-Implementation Checklist

Before implementing, you MUST:

1. [ ] Read and understand `docs/guides/AI_FEATURE_GUIDE.md`
2. [ ] Find the SIMPLEST solution that solves the problem
3. [ ] Check for similar patterns in the codebase
4. [ ] Use self-documenting code (no comments unless necessary)
5. [ ] Complete the Quality Checklist (Section 8 of the guide)

## Reminders

- All UI text must be in Spanish (Costa Rica market)
- Use existing patterns from the codebase
- Follow the code philosophy: simplicity, self-documenting, no code smells
- Log key actions with `logger.info/error`
```

---

## Quick Version (Simple Features)

For straightforward features, use this compact format:

```markdown
**Feature**: [Brief description]

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Requirements**:

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Spanish UI Text**:

- [Button/label]: "[Spanish text]"
```

### Example:

```markdown
**Feature**: Add "Share Ride" button to ride detail screen

**Follow**: `docs/guides/AI_FEATURE_GUIDE.md`

**Requirements**:

- Button visible to both drivers and passengers
- Opens native share sheet with ride link
- Include ride origin, destination, and time in shared text

**Spanish UI Text**:

- Button: "Compartir viaje"
- Shared text: "¡Únete a mi viaje en Carpil!"
```
