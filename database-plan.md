# Dog Date – Database Plan

**Database Choice:** PostgreSQL

## Entities (Tables)

### 1. Users
Represents each dog owner.

| Column          | Type         | Constraints / Notes                                   |
|-----------------|--------------|-------------------------------------------------------|
| id              | SERIAL PK    | Primary key                                           |
| name            | TEXT         |                                                       |
| email           | TEXT         | **NOT NULL**, **UNIQUE**                              |
| password_hash   | TEXT         | **NOT NULL** (hashed)                                 |
| bio             | TEXT         |                                                       |
| location        | TEXT         | City or neighborhood                                  |
| available_times | TEXT         | Simple text for now (e.g., "weeknights")             |
| created_at      | TIMESTAMPTZ  | DEFAULT `now()`                                       |

**Indexes**
- `UNIQUE (email)`

---

### 2. Dogs
Represents each dog profile.

| Column             | Type        | Constraints / Notes                                             |
|--------------------|-------------|-----------------------------------------------------------------|
| id                 | SERIAL PK   | Primary key                                                     |
| owner_id           | INT FK      | **NOT NULL**, references `users(id)` ON DELETE CASCADE          |
| name               | TEXT        | **NOT NULL**                                                    |
| sex                | TEXT        | CHECK (`sex` IN ('male','female','unknown'))                    |
| breed              | TEXT        |                                                                 |
| age                | INT         | CHECK (`age` >= 0)                                              |
| size               | TEXT        | CHECK (`size` IN ('small','medium','large','giant'))            |
| temperament        | TEXT        | Short description                                               |
| vaccination_status | TEXT        | e.g., 'up_to_date', 'needs_shots'                               |
| photo_url          | TEXT        | CDN/Cloudinary URL                                              |
| created_at         | TIMESTAMPTZ | DEFAULT `now()`                                                 |

**Indexes**
- `INDEX (owner_id)`
- Consider `INDEX (breed)`, `INDEX (size)` for browse filters.

---

### 3. PlaydateRequests
Represents invitations between users (usually for specific dogs).

| Column        | Type        | Constraints / Notes                                                                           |
|---------------|-------------|------------------------------------------------------------------------------------------------|
| id            | SERIAL PK   | Primary key                                                                                    |
| sender_id     | INT FK      | **NOT NULL**, references `users(id)` ON DELETE CASCADE                                         |
| receiver_id   | INT FK      | **NOT NULL**, references `users(id)` ON DELETE CASCADE                                         |
| dog_id        | INT FK      | **NOT NULL**, references `dogs(id)` ON DELETE CASCADE                                          |
| date          | DATE        |                                                                                                |
| time          | TIME        |                                                                                                |
| location      | TEXT        | Meetup spot                                                                                    |
| status        | TEXT        | **NOT NULL**, CHECK (`status` IN ('pending','accepted','rejected','canceled')) DEFAULT 'pending' |
| created_at    | TIMESTAMPTZ | DEFAULT `now()`                                                                                |

**Indexes**
- `INDEX (sender_id)`
- `INDEX (receiver_id)`
- `INDEX (dog_id)`
- Optional: `(receiver_id, status)` to query “my pending requests”.

---

### 4. Likes
Represents one dog liking another (for matching).

| Column      | Type        | Constraints / Notes                                               |
|-------------|-------------|-------------------------------------------------------------------|
| id          | SERIAL PK   | Primary key                                                       |
| from_dog_id | INT FK      | **NOT NULL**, references `dogs(id)` ON DELETE CASCADE             |
| to_dog_id   | INT FK      | **NOT NULL**, references `dogs(id)` ON DELETE CASCADE             |
| created_at  | TIMESTAMPTZ | DEFAULT `now()`                                                   |

**Constraints & Indexes**
- **UNIQUE (`from_dog_id`, `to_dog_id`)** to prevent duplicate likes.
- `CHECK (from_dog_id <> to_dog_id)` so a dog can’t like itself.
- `INDEX (from_dog_id)`, `INDEX (to_dog_id)`.

> **Possible derived concept (later):** a *match* occurs when A likes B **and** B likes A.
> This can be queried; no need for a separate table unless you want to materialize matches.

---

### 5. Messages
Represents chat messages between users (optionally tied to a playdate).

| Column      | Type        | Constraints / Notes                                             |
|-------------|-------------|-----------------------------------------------------------------|
| id          | SERIAL PK   | Primary key                                                     |
| sender_id   | INT FK      | **NOT NULL**, references `users(id)` ON DELETE CASCADE          |
| receiver_id | INT FK      | **NOT NULL**, references `users(id)` ON DELETE CASCADE          |
| playdate_id | INT FK      | Optional, references `playdaterequests(id)` ON DELETE SET NULL  |
| content     | TEXT        | **NOT NULL**                                                    |
| sent_at     | TIMESTAMPTZ | DEFAULT `now()`                                                 |

**Indexes**
- `(sender_id, sent_at DESC)`
- `(receiver_id, sent_at DESC)`
- Optional: `(playdate_id, sent_at)` for playdate threads.

---

## Relationships

- **Users → Dogs**: One-to-Many  
  Each user can own multiple dogs.

- **Users ↔ PlaydateRequests**: Many-to-Many through `sender_id`/`receiver_id`  
  A user can send many requests and receive many requests.

- **Dogs → PlaydateRequests**: One-to-Many  
  Each playdate request is tied to one initiating dog.

- **Dogs ↔ Likes**: Many-to-Many via `Likes(from_dog_id, to_dog_id)`  
  A dog can like many dogs and be liked by many dogs.

- **Users → Messages**: One-to-Many  
  Each user can send many messages.

- **PlaydateRequests → Messages**: One-to-Many  
  A playdate can have multiple chat messages.

---

## Notes / Future Considerations
- Consider migrating enums to real **Postgres `ENUM` types** later for `sex`, `size`, `status`.
- Add **soft delete** (`deleted_at TIMESTAMPTZ`) if you want reversible deletes.
- If you switch to UUIDs: use `uuid` with `gen_random_uuid()` instead of `SERIAL`.
- Privacy: avoid exposing emails directly from APIs; prefer user display names.
