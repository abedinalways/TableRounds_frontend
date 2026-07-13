'use client';

import React, { useRef } from 'react';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  useGetUserSubscriptionPlansQuery,
  useGetMyActiveSubscriptionQuery,
  useBuySubscriptionMutation,
} from '@/app/redux/api/userFinancialApi';
import { useAppSelector } from '@/app/redux/hook';
import { useRouter } from 'next/navigation';

type DisplayPlan = {
  id: string;
  name: string;
  price: string;
  billing_period: string;
  benefits: string[];
  is_popular?: boolean;
};

const FREE_PLAN_FALLBACK: DisplayPlan = {
  id: 'free',
  name: 'Free',
  price: '0',
  billing_period: 'forever',
  benefits: [
    '100 free practice questions',
    'Track quiz performance',
    'Flag and review questions',
  ],
};


interface CardProps {
  plan: DisplayPlan;
  isBadged: boolean;
  badgeText?: string;
  badgeColor?: 'green' | 'gold';
  recommended?: boolean;
  disabled: boolean;
  loading: boolean;
  topPriceInfo?: React.ReactNode;
  mainPriceNode: React.ReactNode;
  priceNote?: string;
  btnText: string;
  onSubscribe: () => void;
}

function PlanCard({
  plan,
  isBadged,
  badgeText,
  badgeColor = 'green',
  recommended = false,
  disabled,
  loading,
  topPriceInfo,
  mainPriceNode,
  priceNote,
  btnText,
  onSubscribe,
}: CardProps) {
  return (
    <div
      className={cn(
        'pricing-card relative flex flex-col rounded-2xl border overflow-hidden p-6 opacity-0 translate-y-8',
        'transition-all duration-300 ease-out hover:-translate-y-2 h-full',
        recommended
          ? 'bg-[#01281e] border-[#00B977]/30 shadow-[0_20px_50px_rgba(0,185,119,0.15)]'
          : 'bg-white border-[#e8e8e8] shadow-sm hover:shadow-2xl',
      )}
    >
      {/* Recommended Top Highlight bar */}
      {recommended && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B79E6B] to-[#00B977]" />
      )}

   
      <div className="flex flex-col mb-4">
        <div className="h-8 flex items-center mb-2">
          {isBadged && badgeText && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border',
                recommended
                  ? badgeColor === 'gold'
                    ? 'bg-[#B79E6B]/20 text-[#B79E6B] border-[#B79E6B]/30'
                    : 'bg-white/10 text-white border-white/20'
                  : 'bg-[#01281e]/5 text-[#01281e] border-[#01281e]/10',
              )}
            >
              {badgeColor === 'gold' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {badgeText}
            </span>
          )}
        </div>

        <h3
          className={cn(
            'text-2xl font-bold mb-1 tracking-tight min-h-[32px]',
            recommended ? 'text-white' : 'text-[#01281e]',
          )}
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          {plan.name}
        </h3>

  
        <div className="h-[48px] mt-1 flex flex-col justify-center">
          {topPriceInfo}
        </div>
      </div>

  
      <div className="flex-1 flex flex-col justify-start space-y-3 mb-6">
        {plan.benefits.map((benefit, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                'flex-shrink-0 inline-flex w-5 h-5 rounded-full items-center justify-center mt-0.5 shadow-sm',
                recommended ? 'bg-[#00B977]/20' : 'bg-[#00B977]/10',
              )}
            >
              <Check className="w-3 h-3 text-[#00B977] stroke-[3]" />
            </span>
            <span
              className={cn(
                'text-sm leading-snug font-medium text-left',
                recommended ? 'text-white/80' : 'text-neutral-600',
              )}
            >
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-dashed border-neutral-200/50 dark:border-white/10">
        {/* Subscribe Button */}
        <Button
          onClick={onSubscribe}
          disabled={disabled || loading}
          className={cn(
            'w-full py-6 text-sm font-bold rounded-xl transition-transform active:scale-[0.98] mb-4 shadow-sm',
            disabled
              ? 'bg-[#f0f0f0] text-[#aaa] cursor-not-allowed shadow-none border border-neutral-200'
              : recommended
                ? 'bg-gradient-to-r from-[#B79E6B] to-[#cbb585] hover:brightness-110 text-white'
                : 'bg-[#01281e] hover:bg-[#014d38] text-white',
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : btnText}
        </Button>

        {/* Predicted Monthly Cost (Largest font under subscribe button) */}
        <div className="h-[84px] flex flex-col justify-center bg-neutral-50/70 rounded-xl p-3 border border-neutral-100 dark:bg-white/5 dark:border-white/5">
          {mainPriceNode}
          {priceNote && (
            <p
              className={cn(
                'text-[11px] mt-0.5 font-medium',
                recommended ? 'text-white/50' : 'text-neutral-400',
              )}
            >
              {priceNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section Container ──────────────────────────────────────── */
export default function PricingSection() {
  const router = useRouter();
  const token = useAppSelector(state => state.auth.auth.token);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
  } = useGetUserSubscriptionPlansQuery();
  const { data: activeSubscription } = useGetMyActiveSubscriptionQuery(
    undefined,
    { skip: !token },
  );
  const [buySubscription] = useBuySubscriptionMutation();
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

  // GSAP Entrance Animation
  useGSAP(() => {
    if (!plansLoading && !plansError) {
      const tl = gsap.timeline();
      tl.fromTo(
        '.pricing-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      ).fromTo(
        '.pricing-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        '-=0.3',
      );
    }
  }, [plansLoading, plansError]);

  const handleSubscribe = async (planId: string) => {
    if (!token) {
      router.push('/register');
      return;
    }
    if (planId === 'free') return;

    setLoadingPlanId(planId);
    try {
      const res = await buySubscription({
        planId,
        callbackUrl: `${window.location.origin}/dashboard/user/payment`,
      }).unwrap();
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(
          res.message || 'Could not start checkout. Please try again.',
        );
      }
    } catch {
      toast.error('Could not start checkout. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const rawPlans = plans ?? [];
  const hasFreeFromApi = rawPlans.some(p => Number(p.price) === 0);
  const allPlans: DisplayPlan[] = hasFreeFromApi
    ? rawPlans
    : [FREE_PLAN_FALLBACK, ...rawPlans];

  const isCurrentPlan = (plan: DisplayPlan) =>
    activeSubscription?.plan_id === plan.id &&
    activeSubscription?.status === 'active';

  const hasActive = activeSubscription?.status === 'active' && !!token;
  const isFreeUser = !!token && !hasActive;

  return (
    <section ref={containerRef} className="w-full font-[manrope] text-white">
      {/* Header Area */}
      <div className="pricing-header text-center mb-16 opacity-0">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-white bg-gradient-to-r from-[#B79E6B] to-[#9c8455] px-4 py-1.5 rounded-full mb-4 shadow-sm">
          Membership Plans
        </span>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight text-[#01281E]"
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          Built for Boards
        </h2>
        <p className="text-md sm:text-lg md:text-lg max-w-4xl mx-auto font-medium whitespace-nowrap hidden md:block text-[#01281E]">
          Start with 100 free questions. Upgrade for full access to the question
          bank.
        </p>
        <p className="text-white/80 text-sm max-w-md mx-auto font-medium block md:hidden">
          Start with 100 free questions.
          <br />
          Upgrade for full access to the question bank.
        </p>
      </div>

      {/* Loading Skeleton */}
      {plansLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-[460px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Grid containing ALL 4 boxes on 1 single row */}
      {!plansLoading && !plansError && (
        <div className="grid gap-6 items-stretch sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {allPlans.map(plan => {
            const price = Number(plan.price);
            const current = isCurrentPlan(plan);
            const checkoutLoading = loadingPlanId === plan.id;

            const isFree = price === 0;
            const isAnnual = ['yearly', 'year', 'annual'].includes(
              plan.billing_period?.toLowerCase(),
            );
            const is6Months =
              ['6_months', '6 months', '6-month', '6month'].includes(
                plan.billing_period?.toLowerCase(),
              );

            // Use backend is_popular field for recommendation
            const recommended = plan.is_popular || false;

            const badgeText = recommended
              ? 'Most popular'
              : current || (isFree && isFreeUser)
                ? 'Your plan'
                : undefined;

            // 1. TOP DYNAMIC LABELS - Based on billing_period from API
            let topPriceInfo = (
              <p className="text-sm font-medium text-neutral-400">
                Always free
              </p>
            );
            if (isAnnual) {
              topPriceInfo = (
                <div>
                  <p className="text-xs font-bold text-[#B79E6B] tracking-wide">
                    ${price}/yr
                  </p>
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                    Total charged up front for 1 year
                  </p>
                </div>
              );
            } else if (is6Months) {
              topPriceInfo = (
                <div>
                  <p className="text-xs font-bold text-amber-500 tracking-wide">
                    ${price}/6 months
                  </p>
                  <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    Total charged up front for 6 months
                  </p>
                </div>
              );
            } else if (!isFree && plan.billing_period?.toLowerCase() === 'monthly') {
              topPriceInfo = (
                <p className="text-xs font-bold text-neutral-400">
                  Billed monthly
                </p>
              );
            }

            // 2. MAIN BIG PRICE DISPLAY - Calculate per-month equivalent for multi-month plans
            let mainPriceAmount: string;
            let mainPriceSuffix = '/mo';

            if (isFree) {
              mainPriceAmount = '$0';
              mainPriceSuffix = '';
            } else if (isAnnual) {
              // Annual plan: show monthly equivalent
              const monthlyEquivalent = (Number(price) / 12).toFixed(2);
              mainPriceAmount = `$${monthlyEquivalent}`;
            } else if (is6Months) {
              // 6-month plan: show monthly equivalent (e.g., $20/6 months = $3.33/mo)
              const monthlyEquivalent = (Number(price) / 6).toFixed(2);
              mainPriceAmount = `$${monthlyEquivalent}`;
            } else {
              // Monthly plan: use the price as-is
              mainPriceAmount = `$${price}`;
            }

            const mainPriceNode = (
              <div className="flex items-baseline gap-1.5 justify-center">
                <span
                  className={cn(
                    'text-4xl lg:text-5xl font-black tracking-tight leading-none',
                    recommended ? 'text-white' : 'text-[#01281e]',
                  )}
                  style={{ fontFamily: 'var(--font-fraunces), serif' }}
                >
                  {mainPriceAmount}
                </span>
                <span className="text-xs font-bold uppercase text-[#B79E6B] tracking-wider">
                  {mainPriceSuffix}
                </span>
              </div>
            );

            // 3. CTA BUTTON TEXT
            let btnText = 'Subscribe';
            if (isFree) {
              btnText = !token
                ? 'Get Started Free'
                : current || isFreeUser
                  ? 'Current Plan'
                  : 'Free Plan';
            } else if (hasActive) {
              btnText = current ? 'Current Plan' : 'Subscribed';
            }

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isBadged={!!badgeText}
                badgeText={badgeText}
                badgeColor={recommended ? 'gold' : 'green'}
                recommended={recommended}
                disabled={isFree ? !!token : hasActive}
                loading={checkoutLoading}
                topPriceInfo={topPriceInfo}
                mainPriceNode={mainPriceNode}
                priceNote={isFree ? 'No card required' : undefined}
                btnText={btnText}
                onSubscribe={() => handleSubscribe(plan.id)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
