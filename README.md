# 🏥 Patient Management System

A modern web application for managing patient records with real-time multi-tab synchronization and a built-in SQL query tool — all powered by a local PostgreSQL (PGlite) database running entirely in the browser via Shared Web Workers.

---

## ✨ Features

- **Patient Registration**  
  Easily add new patient records including name, age, and gender.

- **SQL Query Tool**  
  Execute arbitrary SQL queries directly against the in-browser PGlite database.

- **Real-time Multi-Tab Synchronization**  
  Data changes in one browser tab are immediately reflected in all other open tabs of the application.

- **Responsive UI**  
  Built with Ant Design for a clean, intuitive, and responsive user experience.

- **Client-Side Database**  
  All data is stored locally in the browser's IndexedDB using PGlite — no backend required.

---

## 🚀 Technologies Used

- **React 19** – Modern JavaScript UI library
- **Ant Design 5** – Enterprise-level component library
- **PGlite (@electric-sql/pglite)** – In-browser PostgreSQL implementation
- **Shared Web Workers** – Shared communication layer for multi-tab syncing
- **Vite** – Lightning-fast build tool and dev server

---

## 🌐 Live Demo

🔗 **Try it here:** [https://elegant-granita-d45c41.netlify.app/](https://elegant-granita-d45c41.netlify.app/)


## 📦 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd patient-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open in your browser:  
   `http://localhost:5173`

---

## 💡 Usage Guide

### 🔄 Multi-Tab Sync

- Open the app in two or more tabs (same URL).
- Changes made in one tab (e.g. adding a patient) will automatically sync and reflect in all other tabs.

### 📝 Patient Registration

1. Navigate to the **Patient Registration** tab.
2. Fill in the form (name, age, gender).
3. Click **Register**.
4. A success notification will confirm the addition.

### 💻 SQL Query Tool

1. Navigate to the **Run SQL Query** tab.
2. Type any SQL command such as:
   ```sql
   SELECT * FROM patients;
   DELETE FROM patients WHERE name = 'John Doe';
   ```
3. Press **Enter** or click **Run Query**.
4. See results or error messages in real-time.

---

## 🏗️ Architecture Overview

The application uses a Shared Web Worker to host a **centralized PGlite instance**, shared among all browser tabs:

1. **Central PGlite Database**  
   A single PGlite instance runs in a Shared Web Worker.

2. **All Tabs Communicate with the Worker**  
   Tabs send queries to and receive data from the worker.

3. **Automatic Broadcasting**  
   On any data change, the worker broadcasts a `dataUpdated` event.

4. **Reactive UI Updates**  
   Each tab listens to `dataUpdated` and re-fetches updated patient data, keeping the UI in sync.

> 💡 No backend or network connection required — all data remains local!

---

## 🔮 Future Enhancements

- **Persistent Data Storage**  
  Improve durability across sessions (PGlite already uses IndexedDB).

- **Advanced SQL Query UI**  
  History, autocomplete, and example queries.

- **Edit/Delete Support**  
  Add ability to update or remove patient records via UI.

- **Filtering & Sorting**  
  Improve data navigation in patient table.

- **Improved Error Handling**  
  Better error messages and edge case feedback.

- **Authentication**  
  Support for user login and data isolation.

---
---

## 🧩 Challenges Faced

- **PGlite Initialization & Vite Optimizations**  
  Getting PGlite to initialize correctly within a Shared Web Worker was tricky due to Vite’s aggressive optimizations and dependency handling. Proper configuration was needed to ensure the worker had access to the bundled database code.

- **Multi-Tab Synchronization**  
  Ensuring reliable real-time sync across tabs required fine-tuned messaging and event listening. In some cases, data appeared stale until a refetch strategy was implemented based on worker broadcasts.

- **Time Constraints**  
  Building the entire app while managing a full-time job required strict time management and weekend sprints to implement core features.
