/**
 * Email service for sending notifications
 *
 * LAB 2 LANE 2: This code works correctly but has NO tests.
 * Trainee creates tests/services/email.test.ts
 */

/**
 * Send a basic email
 */
export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  // Simulate async email sending
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Validate required fields
  if (!to || !subject) {
    return false;
  }

  // Validate email format
  if (!to.includes("@")) {
    return false;
  }

  console.log(`[Email] Sending to ${to}: ${subject}`);
  return true;
}

/**
 * Send an email using a template with variable substitution
 */
export async function sendTemplatedEmail(
  to: string,
  template: string,
  variables: Record<string, string>
): Promise<boolean> {
  // Validate inputs
  if (!to || !template) {
    return false;
  }

  // Replace template variables
  let body = template;
  for (const [key, value] of Object.entries(variables)) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return sendEmail(to, "Templated Email", body);
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(to: string, username: string): Promise<boolean> {
  const template = "Welcome to Thread Engineering Labs, {{username}}! We're glad to have you.";
  return sendTemplatedEmail(to, template, { username });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  const template =
    "Click the following link to reset your password: {{resetLink}}\n\nThis link expires in 24 hours.";
  return sendTemplatedEmail(to, template, { resetLink });
}

/**
 * Send a notification digest email
 */
export async function sendDigestEmail(
  to: string,
  notifications: Array<{ title: string; message: string }>
): Promise<boolean> {
  if (notifications.length === 0) {
    return false;
  }

  const items = notifications.map((n) => `- ${n.title}: ${n.message}`).join("\n");
  const body = `Your notification digest:\n\n${items}`;

  return sendEmail(to, "Your Notification Digest", body);
}
