# 🏨 Hotel Booking System (DBMS Project)

A simple web-based **Property/Hotel Booking System** (Airbnb Clone) developed for the **Database Management System** course. This project allows users to search and book properties while administrators manage the system.

## 🛠️ Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP (Native)
- **Database:** MySQL

## ✨ Features
### User Panel
- **User Authentication:** Secure Login and Registration system.
- **Search Functionality:** Find properties by location or date.
- **Property Details:** View details of rooms/apartments.
- **Booking System:** Users can book properties for specific dates.

### Admin Panel
- **Dashboard:** Overview of system status.
- **Manage Users:** Admin can view or delete users.
- **Property Management:** Add, Update, or Delete property listings.
- **Booking Management:** View all booking records.

## 🗄️ Database Schema
The system uses a relational database with 3 main tables:
1. **`users`** - Stores user and admin info.
2. **`properties`** - Stores hotel details, price, and descriptions.
3. **`bookings`** - Stores booking records (Links User & Property).

## 🚀 How to Run (Using Laragon)

1. **Open Laragon:** Start the Laragon app and click **"Start All"** (Apache & MySQL).
2. **Setup Project Files:**
   - Go to your Laragon root folder (usually `C:\laragon\www`).
   - Create a folder named `bookingsystem` (or your project name).
   - Paste all your project files inside this folder.
3. **Setup Database:**
   - Open **HeidiSQL** (or phpMyAdmin).
   - Create a new database named **`bookingsystem`**.
   - Run the SQL queries (provided below) to create tables.
4. **Run the Website:**
   - Open your browser and go to:
     `http://localhost/bookingsystem/Home.php`

---
**Developed by:** Ajoy Nath & [Team Member Name]
