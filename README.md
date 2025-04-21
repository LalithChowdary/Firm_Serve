# 📚 Legal Case Management System

A full-stack web application built to simplify and streamline the operations of a law firm by managing clients, cases, appointments, billing, staff assignments, and documentation — all in one centralized system.

## 🔗 Live Website: <a href="https://firm-serve.vercel.app/">https://firm-serve.vercel.app/</a> 


## 📌 Features

- ✅ Role-based user authentication and access control
- 👤 Client and staff registration and management
- 📁 Case creation and assignment to both staff and clients
- 📅 Appointment scheduling between clients and staff with conflict prevention
- 📄 Uploading and retrieving documents linked to specific cases
- 💳 Billing and payment tracking per client-case pair
- 🔄 Staff removal with automatic case reassignment or client archiving
- 🛠 Admin dashboard for user control and system oversight

---

## 🧰 Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | Next.js, TypeScript  |
| Backend ORM  | Prisma               |
| Database     | MySQL                |
| Tools Used   | VS Code, MySQL Workbench, GitHub |

---

## ⚙️ Setup Instructions

1. **Clone the repository or unzip the attached file**

   Cloning-

   ```bash
   git clone https://github.com/LalithChowdary/Firm_Serve.git
   cd Firm_Serve
   ```
   
   Unzipping-

   ```bash
   unzip Firm_Serve.zip
   cd Firm_Serve
   ```

2. **Set up the `.env` file if cloned form git hub (not required if unzipped)**
   Add your database URL and any other required environment variables:
   


3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```
   

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6.Demo Login Credentials:

  Admin:
  Email: isaac.grant@example.com
  Password: Isaac123

  Staff:
  Email: john.smith@example.com
  Password: John123

  Client:
  Email: info@acmecorp.com
  Password: Acmecorp123

  📁 Additional credentials are available in the passwords.txt file included in the submission zip.

---

## 🔗 References

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [MySQL Stored Procedures](https://www.mysqltutorial.org/mysql-stored-procedure/)

---

## 👨‍💻 Author

**Lalith**  
B.Tech CSE | Shiv Nadar Institute of Eminence  
GitHub: [github.com/LalithChowdary](https://github.com/LalithChowdary)

**Srinivas**  
B.Tech CSE | Shiv Nadar Institute of Eminence  
GitHub: [github.com/Srinivas](https://github.com/srinivas-2535)

**Trishal**  
B.Tech CSE | Shiv Nadar Institute of Eminence  
GitHub: [github.com/Trishal](https://github.com/trishaladabala)

**Kousik**  
B.Tech CSE | Shiv Nadar Institute of Eminence  
GitHub: [github.com/Kousik](https://github.com/Kowshik3073)


---

## 🛠 Stored Procedures

- `sp_archive_case`
- `sp_archive_client`
- `sp_remove_staff`
