# AI-Solutions Backend API

Full-stack MERN backend for AI-Solutions — CET333 Product Development.

## Tech Stack
- **Node.js** + **Express.js** — server and REST API (NFR5)
- **MongoDB** + **Mongoose** — database (FR4)
- **JWT** — admin authentication (NFR3)
- **Bcryptjs** — password hashing (FR5)
- **Nodemailer** — automated emails (FR2, FR3)
- **Multer** — image uploads (FR7)
- **Helmet + express-rate-limit** — security hardening
- **Google reCAPTCHA v2** — admin login protection (FR5)

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the server
```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

### 4. Seed the admin account (first time only)
```
POST http://localhost:5000/api/admin/seed
```
Default credentials: `admin` / `Admin@123456`  
**Change the password after first login. Disable this route in production.**

---

## API Reference

All admin-protected routes require:  
`Authorization: Bearer <token>`

### Enquiries
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/enquiries | Public | Submit enquiry (FR1) |
| GET | /api/enquiries | Admin | Get all enquiries (FR6) |
| GET | /api/enquiries/:id | Admin | Get single enquiry (FR6) |
| DELETE | /api/enquiries/:id | Admin | Delete enquiry |

### Admin Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/admin/login | Public | Login with CAPTCHA (FR5) |
| GET | /api/admin/me | Admin | Get profile |
| POST | /api/admin/seed | Public | Seed first admin (disable in prod) |

### Articles
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/articles | Public | Get published articles (FR9) |
| GET | /api/articles/:id | Public | Get single article |
| GET | /api/articles/admin/all | Admin | Get all inc. drafts (FR7) |
| POST | /api/articles | Admin | Create article (FR7) |
| PUT | /api/articles/:id | Admin | Update article (FR7) |
| DELETE | /api/articles/:id | Admin | Delete article |

### Events
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/events | Public | Get upcoming events (FR9) |
| GET | /api/events/:id | Public | Get single event |
| GET | /api/events/admin/all | Admin | Get all events (FR7) |
| POST | /api/events | Admin | Create event (FR7) |
| PUT | /api/events/:id | Admin | Update event (FR7) |
| DELETE | /api/events/:id | Admin | Delete event |

### Gallery
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/gallery | Public | Get all images (FR9) |
| GET | /api/gallery/admin/all | Admin | Get all with admin info (FR7) |
| POST | /api/gallery | Admin | Upload image via multipart/form-data (FR7) |
| PUT | /api/gallery/:id | Admin | Update caption/event link |
| DELETE | /api/gallery/:id | Admin | Delete image + file |

> **Upload field name:** `image`  
> **Accepted types:** jpeg, jpg, png, gif, webp  
> **Max size:** 5 MB

### Feedback
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/feedback | Public | Get approved feedback (FR9) |
| POST | /api/feedback | Public | Submit feedback |
| GET | /api/feedback/admin/all | Admin | Get all feedback |
| PATCH | /api/feedback/:id/status | Admin | Approve / hide feedback |
| DELETE | /api/feedback/:id | Admin | Delete feedback |

### Solutions
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/solutions | Public | Get all solutions (FR9) |
| GET | /api/solutions/:id | Public | Get single solution |
| POST | /api/solutions | Admin | Create solution (FR7) |
| PUT | /api/solutions/:id | Admin | Update solution (FR7) |
| DELETE | /api/solutions/:id | Admin | Delete solution |

### Case Studies
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/casestudies | Public | Get all case studies (FR9) |
| GET | /api/casestudies/:id | Public | Get single case study |
| POST | /api/casestudies | Admin | Create case study (FR7) |
| PUT | /api/casestudies/:id | Admin | Update case study (FR7) |
| DELETE | /api/casestudies/:id | Admin | Delete case study |

---

## Folder Structure
```
ai-solutions-backend/
├── server.js              # Entry point
├── .env.example           # Environment template
├── config/
│   └── multer.js          # File upload configuration
├── middleware/
│   └── authMiddleware.js  # JWT protection (NFR3)
├── models/
│   ├── Admin.js           # D3
│   ├── Article.js         # D2a
│   ├── CaseStudy.js       # D6
│   ├── Enquiry.js         # D1
│   ├── Event.js           # D2b
│   ├── Feedback.js        # D4
│   ├── Gallery.js         # D2c
│   └── Solution.js        # D5
├── controllers/           # Business logic
├── routes/                # Express routers
└── utils/
    ├── emailService.js    # Nodemailer (FR2, FR3)
    └── verifyCaptcha.js   # reCAPTCHA (FR5)
```
