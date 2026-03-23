# 🎯 WiMentor Backend 🚀

**WiMentor** is a high-performance mentorship platform designed to connect expert mentors with students. This backend manages secure identity, role-specific professional onboarding, and a dynamic student-teacher relationship engine.

---

### 🛠️ Tech Stack:
*   **Engine:** Node.js & Express.js
*   **Database:** PostgreSQL (Hosted on Neon.tech)
*   **ORM:** Prisma (For powerful relational mapping)
*   **Security:** JSON Web Tokens (JWT) & Bcryptjs
*   **Environment:** Dotenv for secure configuration

---

### 🌟 Key Features:
1.  ✅ **Multi-Role Identity System:** Clean separation between `MENTOR` and `MENTEE` while sharing a single identity table.
2.  ✅ **Professional Onboarding Wizard:** Mentors must complete their professional bio and certifications before appearing on the platform.
3.  ✅ **Connection Engine:** Advanced "Follow/Unfollow" system using implicit Many-to-Many relationships.
4.  ✅ **Feedback Loop:** Full review and rating system with **Auto-Recalculating Average Ratings** for mentors.
5.  ✅ **Deep Relationship Queries:** One-request architecture that fetches users, their reviews, and their connections in a single trip to the database.

---

### 📑 API Documentation (Routes):

#### 🏁 Authentication (`/api/auth`)

**1. Register (`POST /register`)**
Creates a new user account. Auto-creates a `MenteeProfile` if the role is "Mentee".
*   **Request Body:**
    ```json
    {
      "Fname": "John",
      "Lname": "Doe",
      "email": "john.doe@example.com",
      "password": "securepassword123",
      "phone": "670000000",
      "role": "Mentor"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIsInR...",
      "data": {
        "Fname": "John",
        "Lname": "Doe",
        "email": "john.doe@example.com",
        "phone": "670000000",
        "role": "Mentor"
      }
    }
    ```

**2. Login (`POST /login`)**
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK):** Returns the JWT token and basic user info.

**3. Get Me (`GET /me`)**
Requires authentication. Fetches complete profile info of the logged-in user.
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "user-uuid-123",
        "Fname": "John",
        "Lname": "Doe",
        "role": "Mentor",
        "mentorProfile": {
          "id": "profile-uuid-123",
          "bio": "Expert in Software Engineering",
          "avRating": 4.8
        }
      }
    }
    ```

**4. Logout (`POST /logout`)**
Clears the HTTP-only cookie to end the session.

---

#### 👨‍🏫 Mentor Dashboard (`/api`)
*(All routes require a valid JWT token)*

**1. Setup Profile (`POST /setup`)**
For Mentors to set up their professional portfolio.
*   **Request Body:**
    ```json
    {
      "hasOlevel": true,
      "oLevelSeries": "Sciences",
      "hasAlevel": false,
      "aLevelSeries": "",
      "currentStatus": "Senior Developer",
      "bio": "I teach clean code and system design.",
      "location": "Yaoundé"
    }
    ```

**2. Follow connection (`POST /follow/:mentorUserId`)**
Mentee starts following a specific Mentor.
*   **Response (200 OK):**
    ```json
    { "message": "successfully followed mentor" }
    ```

**3. Unfollow connection (`POST /unfollow/:mentorUserId`)**
Mentee revokes the connection.

**4. Get All Mentees (`GET /getAllMentees`)**
Mentor fetches their list of current students.
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "mentee-profile-uuid",
          "user": {
            "Fname": "Jane",
            "Lname": "Smith",
            "email": "jane@example.com"
          }
        }
      ]
    }
    ```

**5. Get All Reviews (`GET /getAllReviews`)**
Mentor fetches their feedback.
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "rating": 5,
          "comment": "Amazing teacher! Explained Prisma perfectly.",
          "author": { "user": { "Fname": "Jane", "Lname": "Smith" } }
        }
      ]
    }
    ```

---

#### 🎓 Mentee Discovery (`/api`)
*(All routes require a valid JWT token)*

**1. Get All Mentors (`GET /getAllMentors`)**
Fetches a lightweight list of all Mentors on the platform.
*   **Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "bio": "I teach clean code and system design.",
          "avRating": 4.8,
          "user": { "Fname": "John", "Lname": "Doe" },
          "_count": { "mentees": 24 }
        }
      ]
    }
    ```

**2. Get Specific Mentor (`GET /getMentor/:mentorUserId`)**
Fetches a deep profile of one Mentor, including reviews.
*   **Response (200 OK):** Returns detailed mentor data plus nested `reviews` objects.

**3. My Mentors (`GET /mymentors`)**
Shows the Mentee all the teachers they are currently following.
*   **Response (200 OK):** Returns array of MentorProfiles populated with User details.

**4. My Reviews (`GET /myReviews`)**
Shows the Mentee all the reviews they have previously written.

---

### 🚀 Getting Started:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Sync your database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
3.  **Run the engine:**
    ```bash
    npm run dev
    ```

**WiMentor Backend is production-ready!**
