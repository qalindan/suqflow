# SuqFlow 

A comprehensive, cross-platform retail point-of-sale (POS) and bookkeeping application. This monorepo houses the complete technical ecosystem designed to streamline storefront operations, manage inventory, and track daily sales efficiently across web and mobile platforms.

The system is designed as a highly focused operational tool, strictly prioritizing core reliability, manual ledger accuracy, and real-time checkout workflows over predictive data models or machine learning feature bloat.

## 🏗 Monorepo Architecture

This repository contains three primary workspaces, organized to separate concerns while maintaining a unified full-stack environment.

| Workspace | Technology Stack | Purpose |
| --- | --- | --- |
| **`/suqflow-frontend`** | Next.js, React, Tailwind CSS, TypeScript | The web-based management dashboard for store owners. Handles inventory oversight, detailed bookkeeping, and reporting. |
| **`/suqflow-backend`** | Node.js, Express/FastAPI, TypeScript | The centralized API service bridging the web dashboard and mobile app, handling authentication, database operations, and core business logic. |
| **`/suqflow-mobile`** | React Native, Expo | The mobile POS terminal application designed for on-the-floor retail staff to process fast checkouts and log immediate inventory updates. |

## ✨ Core Features

* **Real-Time POS Checkout:** Rapid transaction processing interface for both the mobile application and web dashboard.
* **Synchronized Bookkeeping:** Accurate ledger system for tracking daily revenue, operational expenses, and net margins.
* **Inventory Management:** Complete management for store stock, including pricing updates, categorization, and tracking.
* **Cross-Platform Data Parity:** Seamless, immediate data synchronization between the administrative web dashboard and the mobile checkout terminals.
* **Premium Interface Design:** The application utilizes a modern "quiet luxury" visual aesthetic. It features a deep dark mode palette (utilizing an `#0a0a0c` base with `#f3f3f2` typography) accented by subtle geometric vector motifs inspired by traditional ጥበብ and መሶብ patterns, resulting in a culturally grounded, high-end user experience.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

* Node.js (v18 or higher)
* npm, yarn, or pnpm
* Git
* Expo CLI (for the mobile environment)

### Installation & Setup

**1. Clone the repository:**

```bash
git clone https://github.com/qalindan/suqflow.git
cd suqflow

```

**2. Initialize the Backend:**

```bash
cd suqflow-backend
npm install
npm run dev

```

**3. Initialize the Web Frontend:**
Open a new terminal tab and run:

```bash
cd suqflow/suqflow-frontend
npm install
npm run dev

```

**4. Initialize the Mobile App:**
Open a third terminal tab and run:

```bash
cd suqflow/suqflow-mobile
npm install
npx expo start

```

## 📜 Development Workflow

This repository reflects an iterative, full-stack engineering lifecycle. Development is structured sequentially across the frontend web architecture, backend API integration, and mobile platform consumption, maintaining strict separation of concerns within the monorepo ecosystem.
