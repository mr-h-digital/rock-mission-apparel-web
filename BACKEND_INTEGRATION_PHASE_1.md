# Kingdom Drip Phase 1: Backend Integration Checklist

## Overview

This guide helps the Java/Spring Boot API team implement the backend endpoints needed for Phase 1 to work end-to-end with real data.

---

## Required API Endpoints

### 1. **GET /api/impact/metrics** (Priority: HIGH)

**Purpose:** Returns real-time Kingdom Drip impact metrics for the animated ImpactTracker component.

**Endpoint:** `GET /api/impact/metrics`

**Authentication:** None (public endpoint)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "totalFundsRaised": 15240,
  "totalOrdersProcessed": 124,
  "youthMentored": 342,
  "familiesFed": 87,
  "communityProjects": 12,
  "daysActive": 45
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Unable to calculate impact metrics"
}
```

**Implementation Notes:**

| Metric | SQL Logic | Notes |
|--------|-----------|-------|
| `totalFundsRaised` | `SELECT SUM(total_amount) FROM orders WHERE status = 'PAID'` | Sum of all paid order totals in cents (convert to ZAR in response) |
| `totalOrdersProcessed` | `SELECT COUNT(*) FROM orders WHERE status = 'PAID'` | Count of successfully paid orders |
| `youthMentored` | Hardcode or fetch from Rock Mission metrics table | Placeholder for MVP: `342` |
| `familiesFed` | Hardcode or fetch from Rock Mission metrics table | Placeholder for MVP: `87` |
| `communityProjects` | Hardcode or fetch from Rock Mission metrics table | Placeholder for MVP: `12` |
| `daysActive` | `DATEDIFF(day, store_launch_date, NOW())` | Days since Kingdom Drip launched |

**Cache Strategy (Recommended):**
- Cache results for 5 minutes (frontend refreshes every 5 minutes)
- Use Spring `@Cacheable` with TTL configuration
- Invalidate cache on successful order payment

**Example Spring Boot Implementation:**
```java
@RestController
@RequestMapping("/api/impact")
public class ImpactController {

  @Autowired
  private OrderRepository orderRepository;

  @GetMapping("/metrics")
  @Cacheable(value = "impact_metrics", cacheManager = "cacheManager")
  public ImpactMetricsResponse getMetrics() {
    Long fundsRaised = orderRepository.sumPaidOrderTotals();
    Long ordersProcessed = orderRepository.countPaidOrders();
    
    return ImpactMetricsResponse.builder()
      .totalFundsRaised(fundsRaised / 100) // Convert cents to ZAR
      .totalOrdersProcessed(ordersProcessed)
      .youthMentored(342L) // TODO: Link to Rock Mission data
      .familiesFed(87L)
      .communityProjects(12L)
      .daysActive(calculateDaysActive())
      .build();
  }

  private Long calculateDaysActive() {
    LocalDate launchDate = LocalDate.of(2026, 8, 13);
    return ChronoUnit.DAYS.between(launchDate, LocalDate.now());
  }
}
```

---

## Frontend Integration Points

### Where the Frontend Calls This Endpoint

**File:** `src/context/ImpactContext.jsx`

**Function:** `useEffect` hook in `ImpactProvider`

**Behavior:**
- Called on app load
- Auto-refreshes every 5 minutes
- Falls back to hardcoded defaults if API returns error or is unavailable
- Does NOT block page rendering

**Code:**
```javascript
useEffect(() => {
  const fetchImpact = async () => {
    const API_URL = import.meta.env.VITE_API_URL
    if (!API_URL) return // Gracefully skip if no API configured

    try {
      const res = await fetch(`${API_URL}/api/impact/metrics`)
      if (res.ok) {
        const data = await res.json()
        setImpact(data) // Updates impact state globally
      }
    } catch (err) {
      console.error('Error fetching impact metrics:', err)
      // Uses default data instead
    }
  }

  fetchImpact()
  const interval = setInterval(fetchImpact, 5 * 60 * 1000) // Refresh every 5 min
  return () => clearInterval(interval)
}, [])
```

---

## Future Enhancements (Not Phase 1)

### Real-Time WebSocket Updates (Phase 3+)
Consider WebSocket support for live updates when orders come in:
- Frontend subscribes to `ws://api/impact/live`
- Backend broadcasts impact delta on order payment
- Frontend updates counters in real-time without refresh delay

### Detailed Impact Breakdown (Phase 3+)
Add endpoints for deeper impact stories:
- `GET /api/impact/projects` — List of specific projects funded
- `GET /api/impact/stories` — Customer testimonials (programmatic)
- `GET /api/impact/timeline` — Month-by-month impact growth

---

## Testing the Integration

### Local Development (No Backend)

Frontend uses hardcoded defaults. No API call needed. Home page renders fully.

```bash
npm run dev
# Visit http://localhost:5173
# ImpactTracker shows default data
```

### With Backend Deployed

1. Set `VITE_API_URL` in `.env.local`:
   ```bash
   VITE_API_URL=http://localhost:8080
   # or
   VITE_API_URL=https://kingdomdrip-api.rockmission.co.za
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Open browser DevTools → Network tab
4. Reload page
5. Should see `GET /api/impact/metrics` request
6. ImpactTracker counters animate with real data

### Unit Test Example (Backend)

```java
@SpringBootTest
public class ImpactControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private OrderRepository orderRepository;

  @Test
  public void testGetImpactMetrics() throws Exception {
    when(orderRepository.sumPaidOrderTotals()).thenReturn(1524000L); // 15,240 ZAR in cents
    when(orderRepository.countPaidOrders()).thenReturn(124L);

    mockMvc.perform(get("/api/impact/metrics"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.totalFundsRaised").value(15240))
      .andExpect(jsonPath("$.totalOrdersProcessed").value(124));
  }
}
```

---

## Deployment Checklist

Before merging Phase 1 to `main`:

### Backend
- [ ] `/api/impact/metrics` endpoint implemented
- [ ] Endpoint tested locally with real data
- [ ] Cache strategy configured (5-min TTL recommended)
- [ ] Database queries optimized (no N+1, proper indexes)
- [ ] Error handling in place (500 response if query fails)
- [ ] CORS configured to allow frontend domain
- [ ] Deployed to Railway or staging environment

### Frontend
- [ ] `VITE_API_URL` set in deployment environment
- [ ] ImpactTracker renders with real data
- [ ] Counters animate smoothly
- [ ] Page loads quickly (API response < 500ms ideally)
- [ ] Graceful fallback if API is down or slow

### Cross-Functional
- [ ] Marketing team given access to test URL
- [ ] Metrics updated and validated against Rock Mission records
- [ ] Documentation updated in API README
- [ ] Team trained on metric meanings

---

## Troubleshooting

### ImpactTracker Shows Default Data Instead of Real Data

**Cause:** API endpoint not deployed or `VITE_API_URL` not set

**Fix:**
1. Check `VITE_API_URL` in frontend `.env.local`
2. Test API directly: `curl https://kingdomdrip-api.rockmission.co.za/api/impact/metrics`
3. Check browser console for network errors

### Counters Don't Animate

**Cause:** Component mounted after data loaded or missing dependency

**Fix:** Refresh browser (hard refresh: Ctrl+Shift+R)

### High API Latency

**Cause:** Database queries slow or no caching

**Fix:**
1. Index the `orders` table by `status` and `created_at`
2. Enable response caching (5-minute TTL)
3. Consider pre-computing metrics daily

---

## Database Schema Requirements

Ensure the `orders` table has these fields:

```text
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT,
  total_amount INT, -- in cents (e.g., 16490 = 164.90 ZAR)
  status VARCHAR(20), -- 'PENDING', 'PAID', 'FAILED', 'CANCELLED'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

CREATE INDEX idx_status_created ON orders (status, created_at);
CREATE INDEX idx_paid_at ON orders (paid_at);
```

---

## Summary

| Item | Status | Owner | Deadline |
|------|--------|-------|----------|
| `/api/impact/metrics` endpoint | ⏳ TODO | Backend Team | This sprint |
| Local testing + unit tests | ⏳ TODO | Backend Team | This sprint |
| Deployment to Railway | ⏳ TODO | DevOps | End of sprint |
| Frontend integration testing | ✅ READY | Frontend | When backend deployed |
| Go-live validation | ⏳ TODO | QA + Product | End of sprint |

---

## Questions?

- Frontend questions → Check `PHASE_1_IMPLEMENTATION.md`
- Backend questions → Refer to this file or Spring Boot docs
- General architecture → See `rock-mission-apparel-api/README.md`
