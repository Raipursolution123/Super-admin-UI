// Mock API service for email templates
// Ready for backend integration

const mockEmailTemplates = [
  // Account Management
  {
    id: 1,
    name: "Welcome Email",
    category: "Account Management",
    subject: "Welcome to {{company_name}} HRMS!",
    body: `<h2>Welcome to Our HRMS Platform!</h2>
<p>Dear {{admin_name}},</p>
<p>We're thrilled to have <strong>{{company_name}}</strong> join our HRMS family!</p>
<p>Your account has been successfully created and you're all set to revolutionize your HR management.</p>
<h3>What's Next?</h3>
<ul>
  <li>Complete your company profile</li>
  <li>Add your employees</li>
  <li>Explore our powerful features</li>
</ul>
<p><a href="{{login_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a></p>
<p>If you have any questions, our support team is here to help at {{support_email}}.</p>
<p>Best regards,<br>The HRMS Team</p>`,
    variables: ["company_name", "admin_name", "login_url", "support_email"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 2,
    name: "Account Activation",
    category: "Account Management",
    subject: "Activate Your HRMS Account",
    body: `<h2>Activate Your Account</h2>
<p>Hi {{admin_name}},</p>
<p>Please click the button below to activate your HRMS account for {{company_name}}.</p>
<p><a href="{{activation_url}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Activate Account</a></p>
<p>This link will expire in 24 hours.</p>
<p>Best regards,<br>The HRMS Team</p>`,
    variables: ["admin_name", "company_name", "activation_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 3,
    name: "Password Reset",
    category: "Account Management",
    subject: "Reset Your Password",
    body: `<h2>Password Reset Request</h2>
<p>Hi {{admin_name}},</p>
<p>We received a request to reset your password for {{company_name}}'s HRMS account.</p>
<p><a href="{{reset_password_url}}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link expires in 1 hour.</p>`,
    variables: ["admin_name", "company_name", "reset_password_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },

  // Subscription & Billing
  {
    id: 4,
    name: "Trial Started",
    category: "Subscription & Billing",
    subject: "Your Free Trial Has Started!",
    body: `<h2>Welcome to Your Free Trial!</h2>
<p>Hi {{admin_name}},</p>
<p>Your 14-day free trial of our {{plan_name}} plan has started!</p>
<p>Trial ends on: <strong>{{trial_end_date}}</strong></p>
<h3>Explore These Features:</h3>
<ul>
  <li>Employee Management</li>
  <li>Payroll Processing</li>
  <li>Leave Tracking</li>
  <li>Performance Reviews</li>
</ul>
<p><a href="{{login_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Exploring</a></p>`,
    variables: ["admin_name", "plan_name", "trial_end_date", "login_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 5,
    name: "Trial Ending Soon",
    category: "Subscription & Billing",
    subject: "Your Trial Ends in 3 Days",
    body: `<h2>Your Trial is Ending Soon</h2>
<p>Hi {{admin_name}},</p>
<p>Your free trial of the {{plan_name}} plan ends on {{trial_end_date}}.</p>
<p>Don't lose access to your data and features!</p>
<p><a href="{{upgrade_url}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade Now</a></p>
<p>Questions? Contact us at {{support_email}}</p>`,
    variables: ["admin_name", "plan_name", "trial_end_date", "upgrade_url", "support_email"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 6,
    name: "Payment Success",
    category: "Subscription & Billing",
    subject: "Payment Received - Invoice #{{invoice_number}}",
    body: `<h2>Payment Confirmed</h2>
<p>Hi {{admin_name}},</p>
<p>We've received your payment of <strong>{{amount}}</strong> for {{company_name}}'s {{plan_name}} subscription.</p>
<p>Invoice Number: {{invoice_number}}<br>
Payment Date: {{payment_date}}</p>
<p><a href="{{invoice_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Invoice</a></p>
<p>Thank you for your business!</p>`,
    variables: ["admin_name", "company_name", "plan_name", "amount", "invoice_number", "payment_date", "invoice_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },

  // Product Updates
  {
    id: 7,
    name: "New Feature Announcement",
    category: "Product Updates",
    subject: "🎉 New Feature: {{feature_name}}",
    body: `<h2>Exciting New Feature!</h2>
<p>Hi {{admin_name}},</p>
<p>We're excited to announce a new feature: <strong>{{feature_name}}</strong></p>
<p>{{feature_description}}</p>
<p><a href="{{feature_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Learn More</a></p>`,
    variables: ["admin_name", "feature_name", "feature_description", "feature_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 8,
    name: "Maintenance Notification",
    category: "Product Updates",
    subject: "Scheduled Maintenance - {{maintenance_date}}",
    body: `<h2>Scheduled System Maintenance</h2>
<p>Hi {{admin_name}},</p>
<p>We'll be performing scheduled maintenance on {{maintenance_date}} from {{start_time}} to {{end_time}}.</p>
<p>During this time, the HRMS platform will be temporarily unavailable.</p>
<p>We apologize for any inconvenience.</p>`,
    variables: ["admin_name", "maintenance_date", "start_time", "end_time"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },

  // Admin Actions
  {
    id: 9,
    name: "Account Approved",
    category: "Admin Actions",
    subject: "Your Account Has Been Approved!",
    body: `<h2>Account Approved</h2>
<p>Hi {{admin_name}},</p>
<p>Great news! Your HRMS account for {{company_name}} has been approved.</p>
<p>You can now access all features of your {{plan_name}} plan.</p>
<p><a href="{{login_url}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a></p>`,
    variables: ["admin_name", "company_name", "plan_name", "login_url"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
  {
    id: 10,
    name: "Account Suspended",
    category: "Admin Actions",
    subject: "Account Suspended",
    body: `<h2>Account Suspended</h2>
<p>Hi {{admin_name}},</p>
<p>Your HRMS account for {{company_name}} has been temporarily suspended.</p>
<p>Reason: {{suspension_reason}}</p>
<p>Please contact our support team at {{support_email}} for assistance.</p>`,
    variables: ["admin_name", "company_name", "suspension_reason", "support_email"],
    is_active: true,
    is_default: true,
    created_date: "2024-01-01",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const emailTemplatesAPI = {
  getAll: async (params) => {
    await delay(500);

    let filtered = [...mockEmailTemplates];

    // Filter by category
    if (params?.category) {
      filtered = filtered.filter((t) => t.category === params.category);
    }

    // Search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.subject.toLowerCase().includes(searchLower)
      );
    }

    return { data: filtered };
  },

  getById: async (id) => {
    await delay(300);
    const template = mockEmailTemplates.find((t) => t.id === id);
    return { data: template };
  },

  create: async (data) => {
    await delay(500);
    const newTemplate = {
      id: mockEmailTemplates.length + 1,
      created_date: new Date().toISOString().split('T')[0],
      is_active: true,
      is_default: false,
      ...data,
    };
    mockEmailTemplates.push(newTemplate);
    return { data: newTemplate };
  },

  update: async (id, data) => {
    await delay(500);
    const index = mockEmailTemplates.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockEmailTemplates[index] = { ...mockEmailTemplates[index], ...data };
      return { data: mockEmailTemplates[index] };
    }
    throw new Error("Template not found");
  },

  delete: async (id) => {
    await delay(300);
    const index = mockEmailTemplates.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockEmailTemplates.splice(index, 1);
      return { data: { success: true } };
    }
    throw new Error("Template not found");
  },

  sendTest: async (templateId, testEmail) => {
    await delay(1000);
    console.log(`Sending test email to ${testEmail} for template ${templateId}`);
    return { data: { success: true, message: "Test email sent successfully" } };
  },
};

// When backend is ready, replace with:
/*
import API from "./api";

export const emailTemplatesAPI = {
  getAll: (params) => API.get("/email-templates/", { params }),
  getById: (id) => API.get(`/email-templates/${id}/`),
  create: (data) => API.post("/email-templates/", data),
  update: (id, data) => API.put(`/email-templates/${id}/`, data),
  delete: (id) => API.delete(`/email-templates/${id}/`),
  sendTest: (templateId, testEmail) => API.post(`/email-templates/${templateId}/test/`, { email: testEmail }),
};
*/
