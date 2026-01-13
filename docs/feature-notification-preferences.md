# Feature: Notification Preferences

## Overview

Add a comprehensive notification preferences system where users can customize how and when they receive notifications from the application.

## User Stories

1. As a user, I want to choose which notification channels I receive messages on (email, in-app, push)
2. As a user, I want to configure per-event notification rules (e.g., security alerts always, marketing never)
3. As a user, I want to set quiet hours when I don't want to be disturbed
4. As a user, I want to view my notification history

## Requirements

### API Endpoints

- `GET /api/notifications/preferences` - Get current preferences
- `PUT /api/notifications/preferences` - Update preferences
- `GET /api/notifications/history` - Get notification history
- `POST /api/notifications/preferences/quiet-hours` - Set quiet hours
- `DELETE /api/notifications/preferences/quiet-hours` - Remove quiet hours

### Data Model

```typescript
type NotificationPreferences = {
  userId: string;
  channels: {
    email: boolean;
    inApp: boolean;
    push: boolean;
  };
  eventRules: {
    account: NotificationChannel[];
    security: NotificationChannel[];
    marketing: NotificationChannel[];
    updates: NotificationChannel[];
  };
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
    timezone: string;
  };
};
```

### Integration Points

- Must integrate with existing email service (`src/services/email.ts`)
- Must work with existing notification service (`src/services/notifications.ts`)
- Should use existing auth middleware for protected routes

### Technical Requirements

- New notification dispatcher service
- Database schema for preferences and history
- Tests for all new code (>80% coverage)
- API documentation

## Current State

- User model exists (`src/types/index.ts`)
- Email service exists (`src/services/email.ts`)
- Notification service exists (`src/services/notifications.ts`)
- Auth middleware exists (`src/middleware/auth.ts`)
- No notification preferences code exists yet

## Acceptance Criteria

1. Users can view and update their notification preferences
2. Notifications respect channel preferences
3. Quiet hours are enforced
4. Notification history is queryable
5. All new code has tests
6. API is documented

## Task

Use Lab 5: Meta Thread to decompose this feature into 4-7 executable threads.

Document your thread map below:

---

## Thread Map

[Your decomposition here]
