# Kingdom Drip Roadmap: Phases 2–4

**Vision:** Transform Kingdom Drip from an e-commerce store into a **faith-forward lifestyle movement** that builds community, drives impact, and creates Gen Z cult-brand loyalty.

**Timeline:** 12 weeks total (Phases 2–4)

---

## 📊 Strategic Goals

| Goal | Phase | Metric |
|------|-------|--------|
| Build community | 2 | 1,000+ newsletter subscribers |
| Drive urgency | 2–3 | 40% drop conversion rate |
| Deepen loyalty | 3–4 | 20% repeat purchase rate |
| Scale impact | 2–4 | $50K total funds raised |

---

## 🎯 Phase 2: Social & Loyalty (Weeks 3–4)

**Goal:** Build community momentum through social sharing, referrals, and SMS notifications.

### Features

#### 1. **SMS Notifications** 📱
**Priority:** HIGH  
**User Story:** "As a customer, I want SMS alerts for upcoming drops so I don't miss limited releases."

**Implementation:**
- Add SMS opt-in checkbox to DropCalendar "Notify Me" form
- Integrate Twilio or AWS SNS
- Send 24-hour reminder before drop goes live
- Send restock alerts if item comes back in stock

**Backend Endpoints Needed:**
- `POST /api/notifications/sms/subscribe` — Add phone to drop notification list
- `POST /api/notifications/sms/send` — (Admin) Send SMS to subscribers

**Frontend Changes:**
- `DropCalendar.jsx` → Add SMS opt-in toggle
- `src/lib/api.js` → Add `subscribeSmsNotifications()` function
- `src/context/NotificationContext.jsx` → (NEW) Global notification state

**Timeline:** 3 days  
**Estimated Bundle Impact:** +2KB

---

#### 2. **Referral System** 🔗
**Priority:** HIGH  
**User Story:** "As a customer, I want to refer friends to Kingdom Drip and earn rewards."

**Implementation:**
- Generate unique referral codes per user (e.g., `AMIRA_KD_2026`)
- Create shareable links: `kingdom-drip.co.za?ref=AMIRA_KD_2026`
- Track referrals → Award both referrer & referee
- Rewards: Discount code, exclusive product early access, free shipping

**New Components:**
- `src/components/ReferralCard.jsx` — Display referral link + copy button
- `src/components/ReferralStats.jsx` — Show referrer's total referrals + rewards earned

**Backend Endpoints Needed:**
- `POST /api/referrals/generate` — Create referral code for user (auth required)
- `GET /api/referrals/:code` — Validate referral code on signup
- `POST /api/referrals/:code/claim` — Add discount/reward to account
- `GET /api/referrals/user/stats` — Get referral stats for user (auth required)

**Frontend Changes:**
- `src/pages/Account.jsx` → Add "Invite Friends" section
- `src/pages/Checkout.jsx` → Show referral input field
- `src/context/AuthContext.jsx` → Store user's referral code

**Timeline:** 4 days  
**Estimated Bundle Impact:** +3KB

---

#### 3. **Instagram Integration** 📸
**Priority:** MEDIUM  
**User Story:** "As a brand, I want to showcase user-generated content on the Home page."

**Implementation:**
- Embed Instagram feed using `react-instagram-embed`
- Display latest 6 posts tagged `#KingdomDrip`
- Add CTA: "Tag us to be featured 👉 @kingdom_drip"
- Replace hardcoded testimonials with real customer posts (Phase 4)

**New Components:**
- `src/components/InstagramFeed.jsx` — Display latest posts

**Backend Endpoints Needed:**
- `GET /api/instagram/feed` — Fetch latest posts (cached, 1-hour TTL)

**Frontend Changes:**
- `src/pages/Home.jsx` → Add InstagramFeed before final CTA
- `src/lib/api.js` → Add `getInstagramFeed()` function

**Timeline:** 2 days  
**Estimated Bundle Impact:** +1KB (external library handled by npm)

---

#### 4. **Newsletter Signup** 📧
**Priority:** MEDIUM  
**User Story:** "As a customer, I want to subscribe to news about drops and community stories."

**Implementation:**
- DropCalendar "Notify Me" button → Saves email to newsletter list
- Integrate Mailchimp or ConvertKit
- Weekly digest email (new drops, impact update, community story)
- Unsubscribe link in footer

**Backend Endpoints Needed:**
- `POST /api/newsletters/subscribe` — Add email to list
- `GET /api/newsletters/unsubscribe?token=...` — Remove email

**Frontend Changes:**
- `src/components/DropCalendar.jsx` → Already has "Notify Me" form
- `src/lib/api.js` → Add `subscribeNewsletter()` function

**Timeline:** 2 days  
**Estimated Bundle Impact:** 0KB (API call only)

---

#### 5. **Loyalty Tiers** 👑 (Stretch)
**Priority:** LOW  
**User Story:** "As a VIP customer, I want exclusive perks for my repeat purchases."

**Implementation (Future):**
- Bronze (1–2 purchases): Early access to drops
- Silver (3–5 purchases): 10% discount code
- Gold (6+ purchases): VIP pricing + monthly mystery box

**Timeline:** Phase 3  

---

### Phase 2 Deliverables

| Item | Status | Notes |
|------|--------|-------|
| SMS integration | TODO | Backend: Twilio setup, Frontend: opt-in form |
| Referral system | TODO | Backend: code generation + validation, Frontend: share UI |
| Instagram feed | TODO | Backend: API caching, Frontend: component |
| Newsletter signup | TODO | Backend: Mailchimp/ConvertKit API, Frontend: form |
| Testing + QA | TODO | End-to-end testing on all devices |
| Documentation | TODO | Update API docs + user guides |

---

## 🎯 Phase 3: Scarcity & Drops (Weeks 5–8)

**Goal:** Create urgency around limited drops and drive conversion through real-time scarcity mechanics.

### Features

#### 1. **Live Drop Countdown** ⏱️
**Priority:** HIGH  
**User Story:** "As a customer, I want a live countdown to see exactly when a drop launches."

**Implementation:**
- Update DropCalendar to show minute-level countdown (not just date)
- Red background when < 1 hour to launch
- Pulsing animation when drop goes live
- Auto-refresh page on launch

**Frontend Changes:**
- `src/components/DropCalendar.jsx` → Add countdown logic
- `src/hooks/useCountdown.js` → (NEW) Custom hook for countdown timer

**Timeline:** 2 days  

---

#### 2. **Stock Display & "Coming Soon"** 📦
**Priority:** HIGH  
**User Story:** "As a customer, I want to see stock levels so I know how limited an item is."

**Implementation:**
- Show remaining stock on product cards: "3 left in Teal"
- Gray out sold-out colors
- Add waitlist button for sold-out items
- Email notification when back in stock

**Backend Endpoints Needed:**
- `GET /api/products/:id/stock` — Get inventory by color/size
- `POST /api/products/:id/waitlist` — Join waitlist for sold-out item

**Frontend Changes:**
- `src/components/ProductCard.jsx` → Show "X left" badge
- `src/pages/ProductDetail.jsx` → Add color-specific stock
- `src/lib/api.js` → Add stock + waitlist functions

**Timeline:** 3 days  

---

#### 3. **BNPL Integration** 💳
**Priority:** MEDIUM  
**User Story:** "As a Gen Z customer, I want to buy now and pay later without interest."

**Implementation:**
- Integrate Klarna, Afterpay, or local South African BNPL (SnapscanPay)
- Show "Pay in 4" on checkout
- Auto-calculate installments per price point
- Redirect to BNPL provider for approval

**Backend Endpoints Needed:**
- `POST /api/checkout/bnpl/create-session` — Initiate BNPL payment
- `POST /api/checkout/bnpl/callback` — Handle provider callback

**Frontend Changes:**
- `src/pages/Checkout.jsx` → Add BNPL payment option
- `src/components/BnplOption.jsx` → (NEW) Display payment plan

**Timeline:** 4 days  

---

#### 4. **Waitlist Management** ⏰
**Priority:** MEDIUM  
**User Story:** "As a waitlisted customer, I want priority access when an item restocks."

**Implementation:**
- Show waitlist position (#42 in line)
- Send SMS/email when restock happens
- Auto-apply discount for waitlist members (5% off)
- Track how many times item goes in/out of stock

**Backend Endpoints Needed:**
- `GET /api/waitlist/position/:productId/:customerId` — Get position
- `POST /api/admin/waitlist/notify` — (Admin) Send notifications on restock

**Frontend Changes:**
- `src/pages/ProductDetail.jsx` → Show waitlist position
- `src/components/WaitlistCard.jsx` → (NEW) Waitlist UI

**Timeline:** 3 days  

---

#### 5. **Mobile Checkout Polish** 📱
**Priority:** HIGH  
**User Story:** "As a mobile user, I want a fast, one-handed checkout experience."

**Implementation:**
- One-page checkout (no multi-step)
- Auto-fill saved addresses
- Apple Pay / Google Pay buttons
- Minimal form fields (only essentials)
- Estimated delivery date display

**Frontend Changes:**
- `src/pages/Checkout.jsx` → Redesign for mobile-first
- Add Apple Pay / Google Pay SDK

**Timeline:** 3 days  

---

### Phase 3 Deliverables

| Item | Status | Notes |
|------|--------|-------|
| Live countdown | TODO | Frontend component + CSS animation |
| Stock display | TODO | Backend: inventory API, Frontend: badge |
| BNPL integration | TODO | Backend: provider integration, Frontend: checkout flow |
| Waitlist management | TODO | Backend: position tracking + notifications |
| Mobile checkout | TODO | Frontend: responsive redesign |
| Testing + QA | TODO | Focus on mobile conversion rate |

---

## 🎯 Phase 4: Community & VIP (Weeks 9–12)

**Goal:** Transform Kingdom Drip into a lifestyle community with exclusive content and VIP perks.

### Features

#### 1. **Real Testimonials CMS** 💬
**Priority:** MEDIUM  
**User Story:** "As admin, I want to manage customer testimonials without code changes."

**Implementation:**
- Create admin dashboard at `/admin/testimonials`
- Add/edit/delete testimonials from UI
- Upload photos from Instagram or upload manually
- Preview on Home page in real-time

**Backend Endpoints Needed:**
- `GET /api/admin/testimonials` — List all testimonials
- `POST /api/admin/testimonials` — Create new testimonial
- `PUT /api/admin/testimonials/:id` — Update testimonial
- `DELETE /api/admin/testimonials/:id` — Delete testimonial

**Frontend Changes:**
- `src/pages/admin/TestimonialsCMS.jsx` — (NEW) Admin panel
- `src/components/Testimonials.jsx` → Fetch from API instead of hardcoded

**Timeline:** 3 days  

---

#### 2. **Drop Management CMS** 📅
**Priority:** MEDIUM  
**User Story:** "As admin, I want to create and manage drops without touching code."

**Implementation:**
- Admin dashboard at `/admin/drops`
- Schedule drops with launch date/time
- Upload drop images and description
- Set inventory per color/size
- Auto-publish at scheduled time

**Backend Endpoints Needed:**
- `GET /api/admin/drops` — List all drops
- `POST /api/admin/drops` — Create drop
- `PUT /api/admin/drops/:id` — Update drop
- `DELETE /api/admin/drops/:id` — Delete drop
- `POST /api/admin/drops/:id/publish` — Publish drop immediately

**Frontend Changes:**
- `src/pages/admin/DropsCMS.jsx` — (NEW) Admin panel
- `src/components/DropCalendar.jsx` → Fetch from API

**Timeline:** 3 days  

---

#### 3. **Community Discord Bot** 🤖
**Priority:** LOW  
**User Story:** "As a community member, I want to get Kingdom Drip updates in Discord."

**Implementation:**
- Create Discord server for Kingdom Drip community
- Bot posts: new drops, impact updates, community challenges
- Members can earn roles (Bronze, Silver, Gold) through purchases
- Private channels for VIP members

**Backend Endpoints Needed:**
- `POST /api/integrations/discord/send-message` — Post to Discord channel

**Timeline:** Phase 4+ (low priority)

---

#### 4. **VIP Tier Program** 👑
**Priority:** MEDIUM  
**User Story:** "As a loyal customer, I want exclusive perks for my repeat purchases."

**Implementation:**
- Bronze (1–2 purchases): Early access to drops (24 hours)
- Silver (3–5 purchases): 10% discount code + free shipping
- Gold (6+ purchases): VIP pricing + monthly mystery box
- Tier badge on profile
- Auto-upgrade based on purchase history

**Backend Endpoints Needed:**
- `GET /api/user/tier` — Get current user's tier
- `GET /api/admin/tiers/report` — (Admin) See tier distribution
- Recalculate tier on each order (background job)

**Frontend Changes:**
- `src/pages/Account.jsx` → Display tier badge + perks
- `src/components/TierBadge.jsx` → (NEW) Tier display
- `src/pages/Shop.jsx` → Show VIP-only deals

**Timeline:** 3 days  

---

#### 5. **Seasonal Collaborations** 🎨
**Priority:** LOW  
**User Story:** "As a fan, I want to see Kingdom Drip partner with artists and creators."

**Implementation:**
- Collaborate with local Cape Town artists
- Launch limited collab drops (e.g., "Unashamed x [Creator]")
- Feature artist stories on Home page
- Split revenue with collaborators

**Timeline:** Phase 4+ (planning phase)

---

### Phase 4 Deliverables

| Item | Status | Notes |
|------|--------|-------|
| Testimonials CMS | TODO | Backend: CRUD endpoints, Frontend: admin panel |
| Drops CMS | TODO | Backend: scheduling logic, Frontend: drag-drop builder |
| Discord bot | TODO | Backend: Discord SDK integration |
| VIP tier program | TODO | Backend: tier calculation logic, Frontend: tier display |
| Testing + QA | TODO | Focus on admin UX + real-time updates |

---

## 📈 Success Metrics

### Phase 2 (Weeks 3–4)
- Newsletter subscribers: 500+
- Referral conversions: 5% of traffic
- SMS opt-in rate: 20% of checkouts
- Social media followers: +1K

### Phase 3 (Weeks 5–8)
- Drop conversion rate: 30%+
- BNPL transactions: 15% of orders
- Waitlist size: 200+ items tracked
- Mobile checkout completion: 60%+

### Phase 4 (Weeks 9–12)
- VIP members: 100+
- Repeat purchase rate: 20%+
- Community Discord members: 500+
- Total funds raised: $50K+

---

## 🛠️ Tech Debt & Maintenance

### Ongoing
- Update dependencies (npm audit monthly)
- Monitor performance (Lighthouse 85+ always)
- Fix bugs as reported (24-hour SLA)
- Scale database (prepare for 10K MAU)

### Phase 2–4
- Add E2E tests (Cypress or Playwright)
- Set up monitoring (Sentry, DataDog)
- Create user documentation (help center)
- Optimize images (WebP, lazy loading)

---

## 🎯 Resource Allocation

| Phase | Frontend | Backend | Design | QA | Timeline |
|-------|----------|---------|--------|----|----|
| 2 | 2 devs | 1 dev | 0.5 dev | 0.5 dev | 2 weeks |
| 3 | 2 devs | 1.5 devs | 0.5 dev | 1 dev | 4 weeks |
| 4 | 1 dev | 1 dev | 0.5 dev | 0.5 dev | 4 weeks |

---

## 💰 Budget Estimate

| Item | Cost (ZAR) | Notes |
|------|-----------|-------|
| Twilio (SMS) | 1,500/month | Pay-as-you-go |
| Klarna (BNPL) | 2–3% per transaction | Revenue share |
| Mailchimp (Email) | 500/month | Up to 10K subscribers |
| Discord Bot hosting | 200/month | Small instance |
| Monitoring (Sentry) | 1,500/month | Error tracking |
| **Total** | **~6,200/month** | (Scales with revenue) |

---

## 📚 Documentation to Create

### Phase 2
- [ ] SMS integration guide
- [ ] Referral system user guide
- [ ] Newsletter template library

### Phase 3
- [ ] BNPL provider integration guide
- [ ] Mobile checkout best practices
- [ ] Stock management guide

### Phase 4
- [ ] Admin CMS user manual
- [ ] Discord bot command reference
- [ ] VIP program terms & conditions

---

## 🚀 Launch Strategy

### Phase 2 Launch
1. Soft launch to existing customers (email + SMS)
2. 1-week beta with select users
3. Public launch with Instagram campaign
4. Track newsletter opt-ins + referral signups

### Phase 3 Launch
1. Announce BNPL + waitlist in newsletter
2. Create FOMO countdown video for TikTok
3. Track drop conversion rate + mobile metrics
4. Iterate based on feedback

### Phase 4 Launch
1. VIP tier announcement + incentive campaign
2. First collab drop (high-energy)
3. Discord community launch
4. Long-term retention focus

---

## 🎓 Learning & Training

### For Developers
- Weekly knowledge-share sessions (30 min)
- Shadowing on production deployments
- Optional: Gen Z marketing strategy workshop

### For Team
- Brand voice training (how to talk like Kingdom Drip)
- Customer empathy sessions (listen to feedback)
- Quarterly product roadmap reviews

---

## 📞 Stakeholder Communication

### Weekly
- **Team standup:** Progress on current phase + blockers
- **Async updates:** Slack #kingdom-drip channel

### Bi-weekly
- **Product review:** Demo new features to leadership
- **Metrics review:** Track success metrics vs. goals

### Monthly
- **Strategic review:** Adjust roadmap based on market + data
- **Customer feedback:** Incorporate community suggestions

---

## ✅ Go/No-Go Checklist Before Each Phase

Before launching each phase:
- [ ] All features built and merged to `main`
- [ ] QA sign-off (no critical bugs)
- [ ] Performance tested (load time, bundle size)
- [ ] Backend deployed and stable (24h uptime)
- [ ] Documentation complete and reviewed
- [ ] Marketing assets ready (social, email)
- [ ] Customer support trained
- [ ] Analytics configured
- [ ] Rollback plan in place

---

## 🎯 Long-Term Vision (Beyond Phase 4)

- **Year 2:** International expansion (UK, USA, Australia)
- **Year 3:** Physical retail locations (Cape Town flagship)
- **Year 5:** Kingdom Drip becomes lifestyle brand (home goods, media, events)

---

## 📝 Version History

- **v1.0** (Aug 28, 2026): Initial roadmap for Phases 2–4

---

*Last updated: August 28, 2026*  
*Next review: September 4, 2026*  
*Maintained by: @mr-h-digital*
