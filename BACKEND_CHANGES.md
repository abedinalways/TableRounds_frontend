# Backend Changes Required for Dynamic Pricing

## Overview
Frontend এ pricing system dynamically backend থেকে load হবে। তাই backend এ কিছু changes needed to support this functionality.

---

## 1. Database Changes

### Add `is_popular` Column
```sql
-- PostgreSQL
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_popular 
ON subscription_plans(is_popular);

-- MySQL
ALTER TABLE subscription_plans 
ADD COLUMN is_popular BOOLEAN DEFAULT FALSE AFTER benefits;

CREATE INDEX idx_subscription_plans_is_popular 
ON subscription_plans(is_popular);
```

---

## 2. Backend Model/Entity Changes

### If using Prisma (schema.prisma):
```prisma
model SubscriptionPlan {
  id              String    @id @default(cuid())
  name            String
  type            String
  price           Float     // Total price (e.g., 149.99 for annual, 19.99 for monthly)
  billing_period  String    // "monthly", "yearly", "6 months", "forever"
  benefits        String[]
  isPopular       Boolean   @default(false) // NEW FIELD
  stripe_product_id String?
  stripe_price_id    String?
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
  
  @@map("subscription_plans")
}
```

### If using TypeORM:
```typescript
@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  billing_period: string;

  @Column('json')
  benefits: string[];

  @Column({ default: false })
  isPopular: boolean; // NEW FIELD

  @Column({ nullable: true })
  stripe_product_id: string;

  @Column({ nullable: true })
  stripe_price_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### If using Mongoose (MongoDB):
```typescript
import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true, // Total price
  },
  billing_period: {
    type: String,
    required: true,
  },
  benefits: [{
    type: String,
  }],
  isPopular: {
    type: Boolean,
    default: false, // NEW FIELD
  },
  stripe_product_id: String,
  stripe_price_id: String,
}, {
  timestamps: true,
});

export const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
```

---

## 3. User-Facing API Changes

### Endpoint: `GET /api/subscriptions`

**Current Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "plan_123",
      "name": "Monthly",
      "type": "MONTHLY",
      "price": "19.99",
      "billing_period": "monthly",
      "benefits": ["Full access"]
    }
  ]
}
```

**Updated Response (ADD isPopular):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "plan_123",
      "name": "Monthly",
      "type": "MONTHLY",
      "price": "19.99",
      "billing_period": "monthly",
      "benefits": ["Full access"],
      "isPopular": true  // ADD THIS FIELD
    }
  ]
}
```

**Controller Code Example:**
```typescript
// controllers/subscriptionController.ts

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        price: true,
        billing_period: true,
        benefits: true,
        isPopular: true, // ADD THIS LINE
      },
      orderBy: {
        price: 'asc',
      },
    });

    res.json({
      success: true,
      message: 'Plans retrieved successfully',
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
    });
  }
};
```

---

## 4. Admin API Changes

### A. Get All Plans: `GET /api/admin/subscription-plan`

**Response should include `isPopular`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_123",
      "name": "Monthly",
      "type": "MONTHLY",
      "price": 19.99,
      "billing_period": "monthly",
      "benefits": ["Full access"],
      "isPopular": true, // ADD THIS
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ]
}
```

### B. Create Plan: `POST /api/admin/subscription-plan`

**Request Body (ADD isPopular):**
```json
{
  "name": "Monthly",
  "type": "MONTHLY",
  "price": 19.99,
  "billing_period": "monthly",
  "benefits": ["Full access", "Unlimited questions"],
  "isPopular": true  // ADD THIS FIELD
}
```

**Controller Code:**
```typescript
export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { name, type, price, billing_period, benefits, isPopular } = req.body;

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        type,
        price,
        billing_period,
        benefits,
        isPopular: isPopular || false, // ADD THIS LINE
      },
    });

    res.json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating plan',
    });
  }
};
```

### C. Update Plan: `PATCH /api/admin/subscription-plan/:id`

**Request Body (ADD isPopular):**
```json
{
  "price": 24.99,
  "isPopular": false  // ADD THIS FIELD
}
```

**Controller Code:**
```typescript
export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, price, billing_period, benefits, isPopular } = req.body;

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(price && { price }),
        ...(billing_period && { billing_period }),
        ...(benefits && { benefits }),
        ...(isPopular !== undefined && { isPopular }), // ADD THIS LINE
      },
    });

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating plan',
    });
  }
};
```

---

## 5. Admin Panel UI Changes

### Add Toggle in Plan Create/Edit Form

**React Component Example:**
```tsx
// components/admin/PlanForm.tsx

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function PlanForm({ plan }: { plan?: Plan }) {
  const [isPopular, setIsPopular] = useState(plan?.isPopular || false);

  const handleSubmit = async (data: FormData) => {
    await mutate({
      ...data,
      isPopular: isPopular, // Include in submission
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other fields... */}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isPopular"
          checked={isPopular}
          onCheckedChange={setIsPopular}
        />
        <Label htmlFor="isPopular">
          Mark as Most Popular
        </Label>
      </div>

      {/* Rest of form... */}
    </form>
  );
}
```

---

## 6. Validation (Optional but Recommended)

### Ensure Only One Plan is Popular
```typescript
// Add this validation when setting isPopular = true
export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPopular } = req.body;

    // If setting as popular, unset all others
    if (isPopular === true) {
      await prisma.subscriptionPlan.updateMany({
        where: { id: { not: id } },
        data: { isPopular: false },
      });
    }

    // Then update the current plan
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: { isPopular },
    });

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating plan',
    });
  }
};
```

---

## Summary of Backend Changes

| Component | Changes Needed |
|-----------|----------------|
| **Database** | Add `is_popular` BOOLEAN column to `subscription_plans` table |
| **Model/Entity** | Add `isPopular` field (boolean, default: false) |
| **User API** | Include `isPopular` in `GET /subscriptions` response |
| **Admin API - Create** | Accept `isPopular` in `POST /admin/subscription-plan` |
| **Admin API - Update** | Accept `isPopular` in `PATCH /admin/subscription-plan/:id` |
| **Admin API - List** | Return `isPopular` in `GET /admin/subscription-plan` |
| **Admin UI** | Add toggle/checkbox for "Mark as Most Popular" |

---

## Testing Checklist

- [ ] Database migration successful
- [ ] `isPopular` field appears in admin plan list
- [ ] Can create plan with `isPopular: true`
- [ ] Can update plan's `isPopular` status
- [ ] User API returns `isPopular` field
- [ ] Frontend displays "Most popular" badge correctly
- [ ] Changing price in backend updates frontend automatically
- [ ] Only one plan can be marked as popular (if validation added)

---

## Notes

1. **Price Field:** Store the TOTAL price in database (e.g., 149.99 for annual, 89.99 for 6-months, 19.99 for monthly)
2. **Frontend Calculation:** Frontend will automatically calculate monthly equivalent for annual/6-month plans
3. **Backward Compatibility:** If `isPopular` is not set, frontend falls back to 6-month plan as popular
4. **No Breaking Changes:** Existing plans will work without `isPopular` field (defaults to false)