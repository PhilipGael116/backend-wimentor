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
*   `POST /register` - Create a new user (Auto-creates Mentee Profile if selected).
*   `POST /login` - Sign in and receive an Auth Token.
*   `POST /logout` - Clear cookies and end the session.
*   `GET /me` - Fetch the current logged-in user's complete profile (Must provide token).

#### 👨‍🏫 Mentor Dashboard (`/api`)
*   `POST /setup` - The Profile Wizard for new Mentors.
*   `POST /follow/:mentorUserId` - Connect a student to a teacher.
*   `POST /unfollow/:mentorUserId` - Revoke a connection.
*   **`GET /getAllMentees`** - Fetch the current mentor’s student list.
*   **`GET /getAllReviews`** - See feedback from all students.

#### 🎓 Mentee Discovery (`/api`)
*   `GET /getAllMentors` - View every teacher on the platform with counts and ratings.
*   `GET /getMentor/:mentorUserId` - View a deep-profile of a specific mentor.
*   `GET /mymentors` - List every mentor the student is currently following.
*   `GET /myReviews` - See feedback the student has written.

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
