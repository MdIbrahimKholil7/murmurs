# Murmur Web Application

Murmur is a simple web application similar to Twitter, built using **NestJS**, **React**, and **MySQL**.  
Users can post short messages ("murmurs"), follow other users, like murmurs, and view timelines.

---

## Features

- User can **follow** other users
- Timeline displays murmurs from followed users
- Users can **post** and **delete** their own murmurs
- Users can **like** other users' murmurs
- Pagination support (10 murmurs per page)
- View own and other users' profiles with murmurs and follower/following count
- **Frontend tabs** for navigating between Users, Followers, and Following
- Optional: minimal authentication for signup/login

> **Note:** You must **login or sign up** before using the application. Basic signup is required.

---

## Tech Stack

- **Backend:** NestJS, MySQL
- **Frontend:** React, TypeScript
- **Database:** MySQL 8.x
- **Package Managers:** npm, yarn
- **Other Tools:** Docker (for MySQL setup)

---

## Frontend Overview

### Tabs

The frontend has three main tabs for user navigation:  

1. **Users**  
   - Displays all users registered in the application
   - Allows following/unfollowing other users
   - Clicking a user opens their profile

2. **Followers**  
   - Shows users who are following the current logged-in user
   - Navigate to their profiles to see their murmurs

3. **Following**  
   - Shows users that the current user is following
   - Clicking on a user navigates to their profile

### Timeline

- The **Timeline** displays murmurs from users that the current user is following
- Shows murmur text, like count, and the author
- Users can like/unlike murmurs directly from the timeline
- Pagination shows 10 murmurs per page

### Profile Pages

- **Own Profile**
  - Displays name, follower/following counts
  - Lists all murmurs by the logged-in user
  - Delete button available for own murmurs
- **Other Users' Profile**
  - Click on the user name from the timeline card
  - Displays name, follower/following counts
  - Lists all murmurs by that user
  - Only LIKE option is available

> The tabs and profiles are connected: clicking a user in any tab navigates to their profile, and timeline shows their murmurs if followed.

---

## Setup Instructions

### Database

```bash
cd db
docker compose build
docker compose up -d


