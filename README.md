# DineFlow

> A minimalist and modern subscription-based management system to streamline mess operations for students, managers, and admins.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/savagetongue/dineflow)

DineFlow is a comprehensive, subscription-based mess management system designed for educational institutions and hostels. It streamlines operations for managers, provides transparency for students, and offers oversight for administrators. The platform is built on a modular architecture with four key roles: Student, Manager, Admin, and Guest.

## ✨ Key Features

-   **👤 Student Module**: View weekly menus, check billing history and dues, raise complaints with image uploads, and provide suggestions.
-   **🛠️ Manager Module**: Manage student admissions, view/update/delete student profiles, track financial statistics, respond to complaints and suggestions, manage daily expenses, and broadcast messages.
-   **👑 Admin Module**: High-level oversight to monitor manager's responsiveness to student complaints and view mess menus.
-   **🚶 Guest Module**: Simple portal for one-time meal payments without requiring an account.
-   **🎨 Modern UI/UX**: Clean, minimalist, and responsive interface built with Tailwind CSS and shadcn/ui.
-   **🚀 Serverless Architecture**: Powered by Cloudflare Workers for high performance and scalability, with state managed by a single Durable Object.

## 🚀 Technology Stack

-   **Frontend**: React, Vite, React Router, TypeScript
-   **Backend**: Hono on Cloudflare Workers
-   **State Management**: Zustand (Client), Cloudflare Durable Objects (Server)
-   **Styling**: Tailwind CSS, shadcn/ui
-   **UI Components**: Lucide React, Framer Motion, Recharts
-   **Forms**: React Hook Form with Zod for validation

## 📂 Project Structure

The project is organized into two main parts within a single repository:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes, entity definitions, and Durable Object logic.
-   `shared/`: Contains shared types and interfaces used by both the frontend and backend to ensure type safety.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your system. This project uses Bun as the package manager and runtime.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd dineflow_mess_connect
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

## 💻 Development

To start the local development server, which includes the Vite frontend and the Wrangler dev server for the Cloudflare Worker, run the following command:

```bash
bun run dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker backend will automatically restart.

## ☁️ Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    This command bundles the React frontend and prepares the worker script for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command deploys your application using Wrangler. You will need to be logged into your Cloudflare account via the CLI (`wrangler login`).
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/savagetongue/dineflow)

## 🏗️ Architecture

DineFlow utilizes a modern serverless architecture:

-   **Client (Browser)**: A single-page application built with React, responsible for rendering the UI and managing client-side state.
-   **Server (Cloudflare Edge)**: A Hono-based API running on Cloudflare Workers handles all business logic, routing, and request validation.
-   **Persistence**: All application state (users, menus, complaints, etc.) is managed transactionally within a single global **Durable Object**, providing a consistent and reliable data layer without a traditional database.