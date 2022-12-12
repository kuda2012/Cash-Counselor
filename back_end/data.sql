\c cash_counselor_test


DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) <= 25 AND LENGTH(username) >= 5),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL 
);


CREATE TABLE items (
    item_id TEXT PRIMARY KEY,
    username TEXT REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    institution_id TEXT NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'good'
);

create table transactions (
    id text PRIMARY KEY,
    amount NUMERIC(15,2) NOT NULL,
    item_id TEXT REFERENCES items(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT,
    account_id TEXT NOT NULL
);