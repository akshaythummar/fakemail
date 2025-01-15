-- 用户邮箱地址表
CREATE TABLE user_email_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键ID
    user_id TEXT NOT NULL,               -- 关联的用户ID
    email_address TEXT NOT NULL,            -- 邮箱地址
    alias TEXT,                             -- 邮箱备注名
    is_active INTEGER DEFAULT 1,            -- 邮箱是否激活
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    UNIQUE (email_address)
);
CREATE INDEX idx_user_email_addresses_user_id ON user_email_addresses(user_id);

-- 邮件主表
CREATE TABLE emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键ID
    message_id TEXT NOT NULL,               -- 邮件唯一标识符
    user_email_id INTEGER NOT NULL,         -- 关联的用户邮箱ID
    subject TEXT,                           -- 邮件主题
    sender TEXT NOT NULL,                   -- 发件人
    recipient TEXT NOT NULL,                -- 收件人
    cc TEXT,                                -- 抄送人列表
    bcc TEXT,                               -- 密送人列表
    content_type TEXT,                      -- 内容类型
    body_text TEXT,                         -- 纯文本内容
    body_html TEXT,                         -- HTML格式内容
    received_at DATETIME NOT NULL,          -- 接收时间
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    UNIQUE (message_id)
);
CREATE INDEX idx_emails_user_email_id ON emails(user_email_id);
CREATE INDEX idx_emails_received_at ON emails(received_at);

-- 邮件状态表
CREATE TABLE email_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键ID
    email_id INTEGER NOT NULL,              -- 关联的邮件ID
    user_id TEXT NOT NULL,               -- 关联的用户ID
    is_read INTEGER DEFAULT 0,              -- 是否已读
    is_starred INTEGER DEFAULT 0,           -- 是否标星
    is_archived INTEGER DEFAULT 0,          -- 是否归档
    notes TEXT,                             -- 用户备注
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 更新时间
    UNIQUE (email_id, user_id)
);
CREATE INDEX idx_email_status_user_id ON email_status(user_id);

-- 邮件标签表
CREATE TABLE email_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键ID
    name TEXT NOT NULL,                     -- 标签名称
    user_id TEXT NOT NULL,               -- 关联的用户ID
    color TEXT,                             -- 标签颜色
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    UNIQUE (name, user_id)
);

-- 邮件-标签关联表
CREATE TABLE email_tag_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 主键ID
    email_id INTEGER NOT NULL,              -- 关联的邮件ID
    tag_id INTEGER NOT NULL,                -- 关联的标签ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    UNIQUE (email_id, tag_id)
);
CREATE INDEX idx_email_tag_relations_tag_id ON email_tag_relations(tag_id);