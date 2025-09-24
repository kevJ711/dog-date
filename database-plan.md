# Dog Date – Database Plan

**Database Choice:** PostgreSQL

## Entities (Tables)

### 1. Users
Represents each dog owner.

| Column          | Type        | Notes                                   |
|-----------------|------------|-----------------------------------------|
| id              | SERIAL PK  | Unique identifier                       |
| name            | TEXT       | Display name                            |
| email           | TEXT       | Unique, required                         |
| password_hash   | TEXT       | For authentication (hashed)              |
| bio             | TEXT       | Short bio                                |
| location        | TEXT       | City or neighborhood                     |
| available_times | TEXT       | Simple text field for now (e.g. evenings)|

---

### 2. Dogs
Represents each dog profile.

| Column            | Type        | Notes                                           |
|-------------------|------------|-------------------------------------------------|
| id                | SERIAL PK  | Unique identifier                               |
| owner_id          | INT FK     | References `users.id`                           |
| name              | TEXT       | Dog’s name                                      |
| sex               | TEXT       | e.g. Male/Female                                |
| breed             | TEXT       | Breed info                                      |
| age               | INT        | Age in years                                    |
| size              | TEXT       | e.g. Small/Medium/Large                         |
| temperament       | TEXT       | Short description                               |
| vaccination_status| TEXT       | e.g. “Up-to-date”, “Needs shots”                |
| photo_url         | TEXT       | Cloudinary image URL                            |

---

### 3. PlaydateRequests
Represents invitations between users.

| Column        | Type        | Notes                                                   |
|-------------- |------------|---------------------------------------------------------|
| id            | SERIAL PK  | Unique identifier                                       |
| sender_id     | INT FK     | References `users.id` (requesting user)                 |
| receiver_id   | INT FK     | References `users.id` (receiving user)                  |
| dog_id        | INT FK     | References `dogs.id` (dog initiating the request)        |
| date          | DATE       | Requested date                                          |
| time          | TIME       | Requested time                                          |
| location      | TEXT       | Meetup spot                                             |
| status        | TEXT       | e.g. “pending”, “accepted”, “rejected”                  |
| created_at    | TIMESTAMP  | Auto-generated                                          |

---

## Relationships

* **Users → Dogs**: One-to-Many  
  Each user can own multiple dogs.

* **Users ↔ PlaydateRequests**: Many-to-Many (through sender/receiver)  
  A user can send many requests and receive many requests.

* **Dogs → PlaydateRequests**: One-to-Many  
  Each playdate request is tied to one initiating dog.

---

