-- ===========================
-- Trackify CRM Extended Seed Data
-- ===========================

-- Roles (already inserted earlier, but included for completeness)
INSERT INTO roles (role_id, role_name, description) VALUES (3, 'ROLE_SALES', 'Sales Representative');
INSERT INTO roles (role_id, role_name, description) VALUES (2, 'ROLE_MANAGER', 'Manager');
INSERT INTO roles (role_id, role_name, description) VALUES (1, 'ROLE_ADMIN', 'Administrator');


-- Users p@123
INSERT INTO users (username, password, email, status)
VALUES
('admin', '$2a$12$MW7QcusREf5XOpktfAecsOxrF7GnXXmOzurEcYEEdNv.n2rUbYCPC', 'admin@trackify.com', 'Active'),
('manager_jane', '$2a$12$MW7QcusREf5XOpktfAecsOxrF7GnXXmOzurEcYEEdNv.n2rUbYCPC', 'jane.manager@trackify.com', 'Active'),
('rep_john', '$2a$12$MW7QcusREf5XOpktfAecsOxrF7GnXXmOzurEcYEEdNv.n2rUbYCPC', 'parts.chakraborty0@gmail.com', 'Active'),
('rep_amy', '$2a$12$MW7QcusREf5XOpktfAecsOxrF7GnXXmOzurEcYEEdNv.n2rUbYCPC', 'amy.rep@trackify.com', 'Active'),
('rep_sam', '$2a$12$MW7QcusREf5XOpktfAecsOxrF7GnXXmOzurEcYEEdNv.n2rUbYCPC', 'sam.rep@trackify.com', 'Active');

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin_user → ADMIN
(2, 2), -- manager_jane → MANAGER
(3, 3), -- rep_john → SALES_REP
(4, 3), -- rep_amy → SALES_REP
(5, 3); -- rep_sam → SALES_REP

-- Customers
INSERT INTO customers (name, email, phone, company, address, created_by)
VALUES
('Acme Corp', 'contact@acme.com', '9876543210', 'Acme Corp', 'Delhi, India', 3),
('Globex Ltd', 'info@globex.com', '9123456780', 'Globex Ltd', 'Mumbai, India', 4),
('Innotech', 'hello@innotech.com', '9988776655', 'Innotech Pvt Ltd', 'Bangalore, India', 3),
('Umbrella Inc', 'sales@umbrella.com', '9112233445', 'Umbrella Inc', 'Chennai, India', 5),
('Wayne Enterprises', 'contact@wayne.com', '9001122334', 'Wayne Enterprises', 'Delhi, India', 4),
('Stark Industries', 'info@stark.com', '9556677889', 'Stark Industries', 'Pune, India', 3),
('Oscorp', 'hello@oscorp.com', '9332211445', 'Oscorp Ltd', 'Hyderabad, India', 5),
('Cyberdyne Systems', 'support@cyberdyne.com', '9445566778', 'Cyberdyne Systems', 'Chennai, India', 3);

-- Deals
INSERT INTO deals (customer_id, deal_name, amount, stage, assigned_to, created_at)
VALUES
(1, 'Website Redesign', 50000.00, 'Proposal', 3, '2025-05-15'),
(2, 'Mobile App Development', 120000.00, 'Lead', 4, '2025-06-10'),
(3, 'Cloud Migration', 200000.00, 'Closed Won', 3, '2025-07-05'),
(4, 'ERP Implementation', 150000.00, 'Proposal', 5, '2025-08-12'),
(5, 'Cybersecurity Audit', 80000.00, 'Lead', 4, '2025-09-01'),
(6, 'AI Integration', 300000.00, 'Closed Lost', 3, '2025-09-20'),
(7, 'E-commerce Platform', 180000.00, 'Proposal', 5, '2025-10-02'),
(8, 'Data Center Upgrade', 250000.00, 'Closed Won', 3, '2025-10-15'),
(2, 'Support Contract Renewal', 60000.00, 'Closed Won', 4, '2025-10-18'),
(6, 'IoT Deployment', 220000.00, 'Lead', 5, '2025-10-25');

-- Tasks
INSERT INTO tasks (deal_id, assigned_to, description, due_date, status)
VALUES
(1, 3, 'Follow up with Acme on proposal', '2025-10-28', 'Pending'),
(2, 4, 'Schedule demo with Globex', '2025-10-30', 'Pending'),
(3, 3, 'Send invoice to Innotech', '2025-10-20', 'Completed'),
(4, 5, 'Prepare ERP demo for Umbrella', '2025-11-02', 'Pending'),
(5, 4, 'Call Wayne Enterprises for audit scope', '2025-10-29', 'Pending'),
(6, 3, 'Post-mortem meeting for lost AI deal', '2025-10-15', 'Completed'),
(7, 5, 'Draft proposal for Oscorp e-commerce', '2025-11-05', 'Pending'),
(8, 3, 'Finalize contract with Cyberdyne', '2025-10-22', 'Completed'),
(9, 4, 'Send renewal invoice to Globex', '2025-10-18', 'Completed'),
(10, 5, 'Arrange IoT workshop for Stark', '2025-11-10', 'Pending');

-- Email Notifications
INSERT INTO email_notifications (user_id, task_id, status)
VALUES
(3, 1, 'Sent'),
(4, 2, 'Sent'),
(3, 3, 'Sent'),
(5, 4, 'Sent'),
(4, 5, 'Sent'),
(3, 6, 'Sent'),
(5, 7, 'Sent'),
(3, 8, 'Sent'),
(4, 9, 'Sent'),
(5, 10, 'Sent');
