# 📅 Simple Booking System

A premium, high-fidelity booking platform built with **React**, **Next.js**, and **Tailwind CSS**. This application features a sleek, modern UI with support for both regular users and administrators.

## ✨ Features

### 🔐 Authentication & Roles
- **Dynamic User Roles**: Roles are automatically assigned based on email (e.g., `admin@example.com`).
- **Unified Auth**: Custom login and signup flows with password support.
- **Persistent Sessions**: Login state and user data are persisted across sessions.
- **Custom Avatars**: Dynamic user initials in the header based on the logged-in user's email.

### 📅 Booking Flow
- **Seamless Booking**: A step-by-step process for selecting dates and time slots.
- **User Pre-filling**: Automatic email detection for logged-in users to ensure accurate booking records.
- **Confirmation Page**: Clear visual feedback after a successful booking.

### 📊 Dashboard (Admin & User)
- **Grid & List Views**: Toggle between a professional table list and a beautiful visual grid of booking cards.
- **Immersive Details**: Click any booking to open a premium detail modal with glassmorphism effects.
- **Powerful Search**: Filter bookings by name, email, or date (Admin only).
- **Status Management**: Admins can approve or revoke bookings with a single click.
- **"My Bookings"**: Users see a personalized view of only their bookings.
- **Interactive Empty States**: Helpful guidance and "Book Now" shortcuts when no bookings are found.

### 🎨 UI & UX
- **Premium Aesthetics**: High-contrast dark mode support, smooth transitions, and custom scrollbars.
- **Floating Navigation**: A smart, contextual navigation bar with role-based tooltips.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
- **Micro-animations**: Subtle hover effects and view transitions for a premium feel.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the App**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Icons**: Custom SVG icons and Lucide-inspired designs
- **Animations**: CSS Transitions, View Transitions API
- **Storage**: LocalStorage for data persistence

## 👥 Demo Users
- **Admin**: `admin@example.com`
- **User**: `user@example.com` or sign up with your own!

---
*Built with precision and high-fidelity design principles.*
