# coffee_test – Repository Summary (Auto-Generated)

**Purpose:** Proof-of-Concept web backend for coffee ordering and loyalty.

**Current Structure:**
- src/app.ts – Express core
- src/server.ts – Server launcher
- prisma/schema.prisma – Base database schema (Users, Stores, Menu, Orders, Payments, Reviews, Loyalty)
- .env.example – Environment template

**Next Planned Stages:**
1. Authentication & Users module
2. Menu & Catalog module
3. Orders & Cart system
4. Payments integration
5. Loyalty & Rewards logic
6. Reviews & Ratings
7. Promotions & Referrals
8. Notifications

**Run locally**
```bash
npm install
npx prisma migrate dev --name init
npm run dev
```
