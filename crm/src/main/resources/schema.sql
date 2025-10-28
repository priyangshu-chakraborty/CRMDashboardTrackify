-- ===========================
-- Trackify CRM Database Schema
-- ===========================

-- 1. Users
CREATE TABLE users (
    user_id      INT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(20) DEFAULT 'Active'
);

-- 2. Roles
CREATE TABLE roles (
    role_id      INT AUTO_INCREMENT PRIMARY KEY,
    role_name    VARCHAR(50) NOT NULL UNIQUE, -- ADMIN, MANAGER, SALES_REP
    description  VARCHAR(100)
);

-- 3. User_Roles (many-to-many)
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- 4. Customers
CREATE TABLE customers (
    customer_id  INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(100),
    phone        VARCHAR(20),
    company      VARCHAR(100),
    address      VARCHAR(255),
    created_by   INT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- 5. Deals
CREATE TABLE deals (
    deal_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT NOT NULL,
    deal_name    VARCHAR(100) NOT NULL,
    amount       DECIMAL(10,2) NOT NULL,
    stage        VARCHAR(50) NOT NULL, -- Lead / Proposal / Closed Won / Closed Lost
    assigned_to  INT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- 6. Tasks
CREATE TABLE tasks (
    task_id      INT AUTO_INCREMENT PRIMARY KEY,
    deal_id      INT NOT NULL,
    assigned_to  INT NOT NULL,
    description  VARCHAR(255),
    due_date     DATE,
    status       VARCHAR(20) DEFAULT 'Pending', -- Pending / Completed
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals(deal_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- 7. Email Notifications
CREATE TABLE email_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    task_id         INT NOT NULL,
    sent_time       DATETIME DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'Sent', -- Sent / Failed
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

-- ===========================
-- Indexes for performance
-- ===========================
CREATE INDEX idx_customers_created_by ON customers(created_by);
CREATE INDEX idx_deals_customer ON deals(customer_id);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
