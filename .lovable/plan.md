

# Phase 2 — Public Pages + Admin Management

## Database Changes

New tables needed via migration:

1. **`students`** — id, name, class, roll_number, dob, father_name, mother_name, mobile, address, created_at, updated_at
2. **`admissions`** — id, student_name, class_applied, dob, father_name, mother_name, mobile, email, address, status (pending/approved/rejected), created_at, updated_at

Both with RLS: public can insert admissions, admin can manage all. Students table admin-only CRUD.

## New Public Pages (5 pages)

1. **`/teachers`** — Fetches from `teachers` table, card grid with photo/name/subject/designation. Reuses the TeachersSection pattern but as a full page with Navbar/Footer.

2. **`/gallery`** — Fetches from `gallery` table, filterable by category, image grid with lightbox-style click-to-enlarge (dialog).

3. **`/downloads`** — Fetches from `downloads` table, grouped by category, each with a download link button.

4. **`/students`** — Static info page with sections: Admission info, Class Routine (placeholder), Exam Routine (placeholder), Results (placeholder). Links to `/admissions`.

5. **`/admissions`** — Online admission form that inserts into `admissions` table. Fields: student name, class applied, DOB, father/mother name, mobile, email, address. Success toast on submit.

## Admin Dashboard Extensions (4 new admin pages)

Following the same CRUD pattern as `AdminNotices`:

1. **`/admin/dashboard/teachers`** — Add/edit/delete teachers (name, subject, designation, qualification, photo URL, display order).

2. **`/admin/dashboard/gallery`** — Add/edit/delete gallery items (title, image URL, category, event date).

3. **`/admin/dashboard/downloads`** — Add/edit/delete downloads (title, file URL, category).

4. **`/admin/dashboard/admissions`** — View admission applications, update status (pending/approved/rejected), delete.

## Navigation Updates

- **Navbar** `navItems` expanded: Home, About, Teachers, Students, Notice Board, Gallery, Downloads, Admissions, Contact
- **AdminLayout sidebar** expanded: Dashboard, Notices, Teachers, Gallery, Downloads, Admissions
- **Mobile admin header** updated with new links

## Dashboard Home

- Fetch actual counts from each table (`notices`, `teachers`, `gallery`, `downloads`) and display real numbers instead of "—".

## Files to Create
- `src/pages/Teachers.tsx`
- `src/pages/Gallery.tsx`
- `src/pages/Downloads.tsx`
- `src/pages/Students.tsx`
- `src/pages/Admissions.tsx`
- `src/pages/admin/AdminTeachers.tsx`
- `src/pages/admin/AdminGallery.tsx`
- `src/pages/admin/AdminDownloads.tsx`
- `src/pages/admin/AdminAdmissions.tsx`

## Files to Edit
- `src/App.tsx` — add all new routes
- `src/components/Navbar.tsx` — expand nav items
- `src/pages/admin/AdminLayout.tsx` — add sidebar links
- `src/pages/admin/DashboardHome.tsx` — live counts

