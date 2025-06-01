# 🏠 Home24-BXP – Backoffice Product Management App

This is a React + TypeScript based back-office admin portal for managing product categories and products. It supports CRUD operations, attribute handling, responsive UI, and mock API integration with `json-server`.

---

## 📦 Tech Stack

- **React 18**
- **TypeScript**
- **Ant Design (UI)**
- **Formik + Yup (Forms & Validation)**
- **React Router DOM**
- **date-fns (Date formatting)**
- **json-server (Mock backend)**
- **Jest + Testing Library (Unit Testing)**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/home24-bxp.git
cd home24-bxp
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create a .env file and copy the content in .env.example


### 4. Start the development server

```bash
npm run dev
```

By default, this starts the Vite development server on `http://localhost:3000`.
can change the port to any free port from vite.config.ts

---

## 🗃️ JSON Server (Mock API)

### Setup

Make sure you have the `db.json` file in the root directory or please contact me on ishannathen@gmail.com.

### Start JSON server:

```bash
npm npm run serve:api
```

This will start the mock backend at `http://localhost:4000`.



Ensure `axios` client is configured to point to `http://localhost:4000` via `.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🧪 Running Tests

Run all unit tests using:

```bash
npm run test
```

To generate coverage report:

```bash
npm run test:coverage
```

---

## 📁 Project Structure

```
src/
├── api/                  # API calls using axios
├── components/           # Reusable components (ProductDrawer, CategoryList, etc.)
├── store/                # Global state (Zustand)
├── types/                # TypeScript interfaces and types
├── utils/                # Helpers (e.g. error messages, tree builders)
├── validation/           # Yup validation schemas
└── App.tsx               # Main application
```

---

## ✅ ESLint & Prettier

- ESLint config is in `eslint.config.mjs`
- Run lint check:

```bash
npm run lint
```

---

## 📦 Environment Variables

Create a `.env` file at the root:

```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## 🧼 Git Ignore

Make sure your `.gitignore` includes:

```bash
node_modules
dist
coverage
.env
```

---

## 🧠 Future Improvements

- Backend authentication
- Pagination from API
- Role-based access
- CI/CD pipeline with GitHub Actions

---

## 👨‍💻 Author

**Ishan Nathen**

---

## 📄 License

MIT
