'use client';

import React from 'react';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useGetUserSubscriptionPlansQuery,
  useGetMyActiveSubscriptionQuery,
  useBuySubscriptionMutation,
  BackendPlanData,
} from '@/app/redux/api/userFinancialApi';
import { useAppSelector } from '@/app/redux/hook';
import { useRouter } from 'next/navigation';

type DisplayPlan = {
  id: string;
  name: string;
  price: string;
  billing_period: string;
  benefits: string[];
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

const formatPrice = (price: string) => {
  const numeric = Number(price);
  return Number.isNaN(numeric) ? price : numeric.toLocaleString();
};

const billingSuffix = (period: string) => {
  const normalized = period?.toLowerCase();
  if (normalized === 'monthly' || normalized === 'month') return '/month';
  if (['yearly', 'year', 'annual'].includes(normalized)) return '/year';
  if (normalized === 'forever') return '';
  return period ? `/${period}` : '';
};

export default function PricingSection() {
  const router = useRouter();
  const token = useAppSelector(state => state.auth.auth.token);

  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
  } = useGetUserSubscriptionPlansQuery();

  const { data: activeSubscription, isLoading: subLoading } =
    useGetMyActiveSubscriptionQuery(undefined, {
      skip: !token,
    });

  const [buySubscription] = useBuySubscriptionMutation();
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    // If user is not logged in, redirect to login
    if (!token) {
      router.push('/login');
      return;
    }

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
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Could not start checkout. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const displayPlans: DisplayPlan[] =
    plans && plans.some(p => Number(p.price) === 0)
      ? plans
      : [FREE_PLAN_FALLBACK, ...(plans ?? [])];

  const isFreePlan = (plan: DisplayPlan) => Number(plan.price) === 0;
  const isCurrentPlan = (plan: DisplayPlan) =>
    activeSubscription?.plan_id === plan.id &&
    activeSubscription?.status === 'active';

  // If user has any active subscription check
  const hasActiveSubscription =
    activeSubscription?.status === 'active' && !!token;

  // For free plan: if user is logged in, free is automatically assigned
  const isFreeSubscribed = token && !hasActiveSubscription;

  // With 3+ tiers, anchor attention on the middle one
  const recommendedIndex =
    displayPlans.length >= 3 ? Math.floor(displayPlans.length / 2) : -1;

  return (
    <section className="w-full py-12 px-4 font-[manrope]">
      <div className="max-w-full mx-auto text-center mb-12">
        <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-white bg-[#B79E6B] px-3 py-1 rounded-full mb-4">
          Membership
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-3"
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          Built for board day
        </h2>
        <p className="text-white text-base md:text-lg max-w-xl mx-auto">
          Start free with 100 questions. Upgrade when you're ready for the full
          bank and the rest of the prep tools.
        </p>
      </div>

      {plansLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-[420px] rounded-2xl bg-[#f7f7f3] animate-pulse"
            />
          ))}
        </div>
      )}

      {plansError && !plansLoading && (
        <p className="text-center text-red-600 text-sm">
          Couldn't load plans right now. Please refresh the page.
        </p>
      )}

      {!plansLoading && !plansError && (
        <div
          className={cn(
            'grid gap-6 max-w-5xl mx-auto',
            displayPlans.length === 1 && 'sm:grid-cols-1 max-w-md',
            displayPlans.length === 2 && 'sm:grid-cols-2',
            displayPlans.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {displayPlans.map((plan, index) => {
            const free = isFreePlan(plan);
            const current = isCurrentPlan(plan);
            const recommended = index === recommendedIndex && !current;
            const checkoutLoading = loadingPlanId === plan.id;

            // Determine button state
            // let isDisabled = false;
            let isDisabled = true;
            let buttonText = 'Subscribe';
            let buttonStyle =
              'bg-[#B79E6B] hover:bg-[#a8905f] text-white cursor-pointer';

            if (free) {
              // Free plan: always disabled if logged in (auto-assigned), else redirect to login
              if (token) {
                isDisabled = true;
                buttonText = 'Free';
                buttonStyle = 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed';
              } else {
                // Not logged in: clicking redirects to login
                buttonText = 'Get Free';
              }
            } else if (hasActiveSubscription) {
              // User has an active subscription - disable all buttons
              isDisabled = true;
              if (current) {
                buttonText = 'Current plan';
              } else {
                buttonText = 'Subscribed';
              }
              buttonStyle = 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed';
            } else if (!token) {
              // Not logged in: clicking any button redirects to login
              buttonText = 'Subscribe';
            }

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border bg-white p-8 flex flex-col transition-all duration-200',
                  recommended
                    ? 'border-[#B79E6B] shadow-[0_8px_30px_rgba(183,158,107,0.25)] scale-[1.02]'
                    : 'border-[#e9e9e9] shadow-sm hover:shadow-md hover:-translate-y-0.5',
                )}
              >
                {recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#B79E6B] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Most balanced
                  </div>
                )}

                {current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#01503b] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    <Check className="w-3.5 h-3.5" />
                    Your plan
                  </div>
                )}

                <h3 className="text-lg font-semibold text-[#01281e] mb-1 mt-2">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-4xl font-bold text-[#01281e]"
                    style={{ fontFamily: 'var(--font-fraunces), serif' }}
                  >
                    ${formatPrice(plan.price)}
                  </span>
                  <span className="text-sm text-[#444950]">
                    {billingSuffix(plan.billing_period)}
                  </span>
                </div>

                <p className="text-xs text-[#8a8f98] mb-6">
                  {free ? 'No card required' : 'Cancel anytime'}
                </p>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isDisabled || checkoutLoading}
                  className={cn(
                    'w-full py-6 text-base font-semibold rounded-md shadow-sm mb-6',
                    buttonStyle,
                    isDisabled && 'cursor-not-allowed',
                  )}
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    buttonText
                  )}
                </Button>

                <div className="space-y-3 mt-auto">
                  {plan.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00B977]/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-[#00B977] stroke-[3]" />
                      </div>
                      <span className="text-sm text-[#444950]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}