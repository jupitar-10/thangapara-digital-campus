

# THANGAPARA HIGH SCHOOL — Phase 1 Plan

## Design System
- **Colors**: Deep Blue (#1a237e), White (#ffffff), Light Gold (#f5c518)
- **Fonts**: Poppins (headings), Roboto (body)
- **Style**: Clean, modern, mobile-responsive with smooth scroll animations

## Phase 1 Scope

### 1. Homepage
- **Scrolling Notice Ticker** at the top with latest announcements
- **Hero Section** with the uploaded school building photo as background, school name, tagline, and two CTA buttons (Admission Open / View Latest Notices)
- **About School** — short intro paragraph
- **Headmaster Message** — photo placeholder + welcome message
- **Teachers Section** — card grid with photo, name, subject (placeholder data)
- **Student Corner** — icon blocks for Admission, Class Routine, Exam Routine, Results
- **School Achievements** — highlight cards
- **Gallery Preview** — photo grid (placeholder images)
- **Important Downloads** — download links section
- **Contact Section** — address, contact form, embedded Google Map
- **Footer** — school info, quick links, social icons, copyright

### 2. About Page
- School history, mission & vision

### 3. Notice Board Page
- List of notices with dates (pulled from database)

### 4. Contact Page
- Address, phone, email, Google Map, contact form

### 5. Navigation
- Responsive top navbar with all menu items (Home, About, Headmaster Message, Teachers, Students, Notice Board, Gallery, Downloads, Admissions, Contact)
- Mobile hamburger menu

### 6. Supabase Backend Setup
- **Database tables**: notices, teachers, gallery, downloads, contact_messages
- **Storage bucket**: for school images (gallery, teacher photos)
- **RLS policies** for public read access and admin write access

### 7. Admin Login (Basic)
- Secure admin login page
- Admin dashboard shell with sidebar navigation
- **Notices management**: Add/edit/delete notices (first admin feature)

## What's Deferred to Phase 2
- Students page, Teachers page, Gallery page, Downloads page, Admissions page
- Full admin dashboard (students, teachers, results, gallery, downloads management)
- Result checking system
- Event calendar
- Remaining database tables (students, admissions, results)

