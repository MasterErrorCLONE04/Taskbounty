<p align="center">
  <h1 align="center">🏆 TaskBounty</h1>
  <p align="center">
    <strong>Escrow-Protected Freelance Task Marketplace</strong>
  </p>
  <p align="center">
    A modern, real-time platform where clients post tasks with bounties and freelancers deliver work — all secured by escrow payments.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#environment-variables">Environment Variables</a>
  </p>
</p>

---

## ✨ Features

### 🎯 Core Marketplace
- **Task/Bounty System** — Clients create tasks with bounties; freelancers apply, get assigned, submit work, and receive payment.
- **Escrow Payments** — Funds are held securely via **Stripe** until work is approved, protecting both parties.
- **Applications Pipeline** — Freelancers browse, filter and apply to open bounties; clients review, accept or reject applicants.
- **Dispute Resolution** — Built-in dispute flow with evidence submission for fair conflict resolution.
- **Task Lifecycle** — Full status workflow: `OPEN → ASSIGNED → IN_PROGRESS → SUBMITTED → COMPLETED` (or `DISPUTED → CLOSED`).

### 💬 Real-Time Messaging
- **Direct Messages** — Full-featured chat interface with message history, powered by **Supabase Realtime**.
- **Floating Chat (×3)** — Up to **3 simultaneous floating chat windows** so you can reply without leaving your current page.
- **Presence System** — See who's **Online / Offline** across the entire application in real-time.
- **Typing Indicators** — Live "Escribiendo..." indicators visible in all chat contexts (main chat, floating windows, cross-interface).

### 💰 Wallet & Finance
- **Digital Wallet** — Track balance, earnings, and transaction history.
- **Withdrawals** — Request payouts from earned bounties.
- **Wallet Settings** — Configure payout preferences.
- **Premium Plans** — Subscription tiers with Stripe Checkout integration.

### 🌐 Social & Discovery
- **Social Feed** — Home feed with task cards, follows, and activity.
- **Discover Page** — Explore trending tasks and featured bounties.
- **User Profiles** — Public profiles with portfolio, stats, and follow/unfollow system.
- **Groups** — Community groups for collaboration.
- **Events** — Events board for community engagement.
- **Hashtags** — Tag-based content discovery.
- **Blog** — Content hub for articles and announcements.
- **Jobs Board** — Dedicated job listings page.

### 🔔 Engagement
- **Notifications** — In-app notification center for task updates, messages, and system alerts.
- **Follow System** — Follow users and tasks to stay updated.
- **Stats Dashboard** — Performance metrics and analytics.

### 🔒 Security & Legal
- **Authentication** — Supabase Auth with session management.
- **Role-Based Access** — Permission system with route protection.
- **Legal Pages** — Terms of Service, Privacy Policy, Cookie Policy, Accessibility, and Ad Disclosure.
- **Security Settings** — Account security management.

### 🔍 SEO & PWA
- **SEO Optimized** — Dynamic `sitemap.xml`, `robots.txt`, Open Graph and Twitter Card meta tags.
- **PWA Ready** — Web App Manifest for installability.
- **Structured Data** — JSON-LD schema markup.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime + Auth + Storage) |
| **Payments** | [Stripe](https://stripe.com/) (Checkout, Webhooks, Escrow) |
| **Validation** | Zod 4 |
| **Dates** | date-fns |
| **Effects** | canvas-confetti |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- A [Supabase](https://supabase.com/) project
- A [Stripe](https://stripe.com/) account

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/taskbounty.git
cd taskbounty
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below for details.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
taskbounty/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home feed
│   ├── layout.tsx              # Root layout (Providers, FloatingChat)
│   ├── tasks/                  # Task CRUD, explore, apply, manage, pay
│   ├── messages/               # Real-time messaging
│   ├── wallet/                 # Balance, withdraw, settings
│   ├── profile/                # User profiles
│   ├── premium/                # Subscription plans & checkout
│   ├── groups/                 # Community groups
│   ├── events/                 # Events board
│   ├── discover/               # Explore content
│   ├── jobs/                   # Job listings
│   ├── notifications/          # Notification center
│   ├── blog/                   # Articles
│   ├── hashtags/               # Tag-based discovery
│   ├── security/               # Account security
│   ├── help/                   # Help center
│   ├── (legal)/                # Legal pages (terms, privacy, etc.)
│   └── api/                    # API routes (webhooks)
│
├── actions/                    # Server Actions (19 modules)
│   ├── tasks.ts                # Task CRUD & lifecycle
│   ├── messages.ts             # Direct messaging
│   ├── applications.ts         # Task applications
│   ├── disputes.ts             # Dispute management
│   ├── finance.ts              # Financial operations
│   ├── premium.ts              # Subscription management
│   ├── social.ts               # Follow/unfollow, feed
│   ├── profile.ts              # Profile management
│   ├── wallet.ts               # Wallet operations
│   └── ...                     # +9 more action modules
│
├── components/                 # React Components (22 modules)
│   ├── layout/                 # TopNavbar, LeftSidebar, RightSidebar
│   ├── messages/               # ChatWindow, FloatingChatSystem, FloatingChatWindow
│   ├── tasks/                  # TaskCard, TasksFeed, task management
│   ├── feed/                   # HomeHero, BountyCard, CreateBountyCard
│   ├── profile/                # Profile cards, stats
│   ├── wallet/                 # Wallet UI components
│   ├── auth/                   # Auth modals & context
│   ├── ui/                     # Shared UI primitives
│   └── ...                     # +14 more component modules
│
├── context/                    # React Context Providers
│   └── PresenceContext.tsx     # Global online + typing presence
│
├── hooks/                      # Custom React Hooks
│   └── usePresence.ts          # Typing indicator hook
│
├── lib/                        # Utilities & clients
│   ├── supabase/               # Supabase client (server + browser)
│   ├── stripe.ts               # Stripe client
│   ├── permissions.ts          # Role-based access control
│   └── validations.ts          # Zod schemas
│
└── public/                     # Static assets
```

---

## 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Application URL (e.g., `http://localhost:3000`) |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 🏗 Architecture Highlights

- **Server Components First** — Pages use Next.js Server Components for fast initial loads with parallel data fetching.
- **Server Actions** — All data mutations go through type-safe server actions (19 modules covering the full domain).
- **Unified Realtime** — A single Supabase Presence channel handles global online status **and** typing indicators, eliminating channel conflicts.
- **Floating Chat System** — Up to 3 concurrent chat windows managed by `FloatingChatSystem`, each with independent state and real-time sync.
- **3-Column Layout** — Responsive social-media-style layout with `LeftSidebar` (navigation), center feed, and `RightSidebar` (widgets).

---

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ using <strong>Next.js</strong>, <strong>Supabase</strong>, and <strong>Stripe</strong>
</p>
