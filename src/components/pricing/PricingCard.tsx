// 'use client';

// import React from 'react';
// import { Check, ShieldCheck, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import {
//   useGetUserSubscriptionPlansQuery,
//   useGetMyActiveSubscriptionQuery,
//   useBuySubscriptionMutation,
//   BackendPlanData,
// } from '@/app/redux/api/userFinancialApi';
// import { useAppSelector } from '@/app/redux/hook';
// import { useRouter } from 'next/navigation';

// type DisplayPlan = {
//   id: string;
//   name: string;
//   price: string;
//   billing_period: string;
//   benefits: string[];
// };

// const FREE_PLAN_FALLBACK: DisplayPlan = {
//   id: 'free',
//   name: 'Free',
//   price: '0',
//   billing_period: 'forever',
//   benefits: [
//     '100 free practice questions',
//     'Track quiz performance',
//     'Flag and review questions',
//   ],
// };

// const formatPrice = (price: string) => {
//   const numeric = Number(price);
//   return Number.isNaN(numeric) ? price : numeric.toLocaleString();
// };

// const billingSuffix = (period: string) => {
//   const normalized = period?.toLowerCase();
//   if (normalized === 'monthly' || normalized === 'month') return '/month';
//   if (['yearly', 'year', 'annual'].includes(normalized)) return '/year';
//   if (normalized === 'forever') return '';
//   return period ? `/${period}` : '';
// };

// export default function PricingSection() {
//   const router = useRouter();
//   const token = useAppSelector(state => state.auth.auth.token);

//   const {
//     data: plans,
//     isLoading: plansLoading,
//     isError: plansError,
//   } = useGetUserSubscriptionPlansQuery();

//   const { data: activeSubscription, isLoading: subLoading } =
//     useGetMyActiveSubscriptionQuery(undefined, {
//       skip: !token,
//     });

//   const [buySubscription] = useBuySubscriptionMutation();
//   const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

//   const handleSubscribe = async (planId: string) => {
//     // If user is not logged in, redirect to login
//     if (!token) {
//       router.push('/register');
//       return;
//     }

//     setLoadingPlanId(planId);
//     try {
//       const res = await buySubscription({
//         planId,
//         callbackUrl: `${window.location.origin}/dashboard/user/payment`,
//       }).unwrap();

//       if (res.success && res.data?.url) {
//         window.location.href = res.data.url;
//       } else {
//         toast.error(
//           res.message || 'Could not start checkout. Please try again.',
//         );
//       }
//     } catch (error) {
//       console.error('Checkout failed:', error);
//       toast.error('Could not start checkout. Please try again.');
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   const displayPlans: DisplayPlan[] =
//     plans && plans.some(p => Number(p.price) === 0)
//       ? plans
//       : [FREE_PLAN_FALLBACK, ...(plans ?? [])];

//   const isFreePlan = (plan: DisplayPlan) => Number(plan.price) === 0;
//   const isCurrentPlan = (plan: DisplayPlan) =>
//     activeSubscription?.plan_id === plan.id &&
//     activeSubscription?.status === 'active';

//   // If user has any active subscription check
//   const hasActiveSubscription =
//     activeSubscription?.status === 'active' && !!token;

//   // For free plan: if user is logged in, free is automatically assigned
//   const isFreeSubscribed = token && !hasActiveSubscription;

//   // With 3+ tiers, anchor attention on the middle one
//   const recommendedIndex =
//     displayPlans.length >= 3 ? Math.floor(displayPlans.length / 2) : -1;

//   return (
//     <section className="w-full py-12 px-4 font-[manrope]">
//       <div className="max-w-full mx-auto text-center mb-12">
//         <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-white bg-[#B79E6B] px-3 py-1 rounded-full mb-4">
//           Membership
//         </span>
//         <h2
//           className="text-4xl md:text-5xl font-bold text-white mb-3"
//           style={{ fontFamily: 'var(--font-fraunces), serif' }}
//         >
//           Built for Boards
//         </h2>
//         <p className="text-white text-base md:text-lg max-w-xl mx-auto">
//           Start with 100 free questions. Upgrade for full access to the question
//           bank.
//         </p>
//       </div>

//       {plansLoading && (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
//           {[1, 2, 3].map(i => (
//             <div
//               key={i}
//               className="h-[420px] rounded-2xl bg-[#f7f7f3] animate-pulse"
//             />
//           ))}
//         </div>
//       )}

//       {plansError && !plansLoading && (
//         <p className="text-center text-red-600 text-sm">
//           Couldn't load plans right now. Please refresh the page.
//         </p>
//       )}

//       {!plansLoading && !plansError && (
//         <div
//           className={cn(
//             'grid gap-6 max-w-5xl mx-auto',
//             displayPlans.length === 1 && 'sm:grid-cols-1 max-w-md',
//             displayPlans.length === 2 && 'sm:grid-cols-2',
//             displayPlans.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
//           )}
//         >
//           {displayPlans.map((plan, index) => {
//             const free = isFreePlan(plan);
//             const current = isCurrentPlan(plan);
//             const recommended = index === recommendedIndex && !current;
//             const checkoutLoading = loadingPlanId === plan.id;

//             // Determine button state
//             // let isDisabled = false;
//             let isDisabled = false;
//             let buttonText = 'Subscribe';
//             let buttonStyle =
//               'bg-[#B79E6B] hover:bg-[#a8905f] text-white cursor-pointer';

//             if (free) {
//               // Free plan: always disabled if logged in (auto-assigned), else redirect to login
//               if (token) {
//                 isDisabled = true;
//                 buttonText = 'Free';
//                 buttonStyle = 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed';
//               } else {
//                 buttonText = 'Get Free';
//               }
//             } else if (hasActiveSubscription) {
//               // User has an active subscription - disable all buttons
//               isDisabled = true;
//               if (current) {
//                 buttonText = 'Current plan';
//               } else {
//                 buttonText = 'Subscribed';
//               }
//               buttonStyle = 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed';
//             } else if (!token) {
//               // Not logged in: clicking any button redirects to login
//               buttonText = 'Subscribe';
//             }

//             return (
//               <div
//                 key={plan.id}
//                 className={cn(
//                   'relative rounded-2xl border bg-white p-8 flex flex-col transition-all duration-200',
//                   recommended
//                     ? 'border-[#B79E6B] shadow-[0_8px_30px_rgba(183,158,107,0.25)] scale-[1.02]'
//                     : 'border-[#e9e9e9] shadow-sm hover:shadow-md hover:-translate-y-0.5',
//                 )}
//               >
//                 {recommended && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#B79E6B] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
//                     <ShieldCheck className="w-3.5 h-3.5" />
//                     Most balanced
//                   </div>
//                 )}

//                 {current && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#01503b] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
//                     <Check className="w-3.5 h-3.5" />
//                     Your plan
//                   </div>
//                 )}

//                 <h3 className="text-lg font-semibold text-[#01281e] mb-1 mt-2">
//                   {plan.name}
//                 </h3>

//                 <div className="flex items-baseline gap-1 mb-1">
//                   <span
//                     className="text-4xl font-bold text-[#01281e]"
//                     style={{ fontFamily: 'var(--font-fraunces), serif' }}
//                   >
//                     ${formatPrice(plan.price)}
//                   </span>
//                   <span className="text-sm text-[#444950]">
//                     {billingSuffix(plan.billing_period)}
//                   </span>
//                 </div>

//                 <p className="text-xs text-[#8a8f98] mb-6">
//                   {free ? 'No card required' : 'Cancel anytime'}
//                 </p>

//                 <Button
//                   onClick={() => handleSubscribe(plan.id)}
//                   disabled={isDisabled || checkoutLoading}
//                   className={cn(
//                     'w-full py-6 text-base font-semibold rounded-md shadow-sm mb-6',
//                     buttonStyle,
//                     isDisabled && 'cursor-not-allowed',
//                   )}
//                 >
//                   {checkoutLoading ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     buttonText
//                   )}
//                 </Button>

//                 <div className="space-y-3 mt-auto">
//                   {plan.benefits.map((benefit, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00B977]/10 flex items-center justify-center mt-0.5">
//                         <Check className="w-3 h-3 text-[#00B977] stroke-[3]" />
//                       </div>
//                       <span className="text-sm text-[#444950]">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }

// 'use client';

// import React from 'react';
// import { Check, ShieldCheck, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import {
//   useGetUserSubscriptionPlansQuery,
//   useGetMyActiveSubscriptionQuery,
//   useBuySubscriptionMutation,
// } from '@/app/redux/api/userFinancialApi';
// import { useAppSelector } from '@/app/redux/hook';
// import { useRouter } from 'next/navigation';

// type DisplayPlan = {
//   id: string;
//   name: string;
//   price: string;
//   billing_period: string;
//   benefits: string[];
// };

// const FREE_PLAN_FALLBACK: DisplayPlan = {
//   id: 'free',
//   name: 'Free',
//   price: '0',
//   billing_period: 'forever',
//   benefits: [
//     '100 free practice questions',
//     'Track quiz performance',
//     'Flag and review questions',
//   ],
// };

// const formatPrice = (price: string) => {
//   const n = Number(price);
//   return Number.isNaN(n) ? price : n.toLocaleString();
// };

// const billingLabel = (period: string): { suffix: string; desc: string } => {
//   const p = period?.toLowerCase();
//   if (p === 'monthly' || p === 'month')
//     return { suffix: '/mo', desc: 'Billed every month' };
//   if (['yearly', 'year', 'annual'].includes(p))
//     return { suffix: '/yr', desc: 'Billed every 12 months' };
//   if (p === 'forever') return { suffix: '', desc: 'Free forever' };
//   return { suffix: period ? `/${period}` : '', desc: '' };
// };

// /** Cheapest plan → largest price text */
// function priceSizeClass(price: number, allPrices: number[]): string {
//   const sorted = [...allPrices].sort((a, b) => a - b);
//   const rank = sorted.indexOf(price); // 0 = cheapest
//   return (['text-7xl', 'text-6xl', 'text-5xl', 'text-4xl'] as const)[
//     Math.min(rank, 3)
//   ];
// }

// export default function PricingSection() {
//   const router = useRouter();
//   const token = useAppSelector(state => state.auth.auth.token);

//   const {
//     data: plans,
//     isLoading: plansLoading,
//     isError: plansError,
//   } = useGetUserSubscriptionPlansQuery();

//   const { data: activeSubscription } = useGetMyActiveSubscriptionQuery(
//     undefined,
//     { skip: !token },
//   );

//   const [buySubscription] = useBuySubscriptionMutation();
//   const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

//   const handleSubscribe = async (planId: string) => {
//     if (!token) {
//       router.push('/register');
//       return;
//     }
//     setLoadingPlanId(planId);
//     try {
//       const res = await buySubscription({
//         planId,
//         callbackUrl: `${window.location.origin}/dashboard/user/payment`,
//       }).unwrap();
//       if (res.success && res.data?.url) {
//         window.location.href = res.data.url;
//       } else {
//         toast.error(
//           res.message || 'Could not start checkout. Please try again.',
//         );
//       }
//     } catch {
//       toast.error('Could not start checkout. Please try again.');
//     } finally {
//       setLoadingPlanId(null);
//     }
//   };

//   const rawPlans = plans ?? [];
//   const hasFreeFromApi = rawPlans.some(p => Number(p.price) === 0);
//   const allPlans: DisplayPlan[] = hasFreeFromApi
//     ? rawPlans
//     : [FREE_PLAN_FALLBACK, ...rawPlans];

//   const freePlan = allPlans.find(p => Number(p.price) === 0);
//   const paidPlans = allPlans.filter(p => Number(p.price) > 0);

//   const isCurrentPlan = (plan: DisplayPlan) =>
//     activeSubscription?.plan_id === plan.id &&
//     activeSubscription?.status === 'active';

//   const hasActive = activeSubscription?.status === 'active' && !!token;
//   const isFreeUser = !!token && !hasActive;

//   const paidPrices = paidPlans.map(p => Number(p.price));
//   const recommendedIdx =
//     paidPlans.length >= 3 ? Math.floor(paidPlans.length / 2) : -1;

//   return (
//     <section className="w-full py-12 px-4 font-[manrope]">
//       {/* ── Header ── */}
//       <div className="max-w-5xl mx-auto text-center mb-10">
//         <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-white bg-[#B79E6B] px-3 py-1 rounded-full mb-4">
//           Membership
//         </span>
//         <h2
//           className="text-4xl md:text-5xl font-bold text-white mb-3"
//           style={{ fontFamily: 'var(--font-fraunces), serif' }}
//         >
//           Built for Boards
//         </h2>
//         <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">
//           Start with 100 free questions. Upgrade for full access to the question
//           bank.
//         </p>
//       </div>

//       {/* ── Skeleton ── */}
//       {plansLoading && (
//         <div className="max-w-5xl mx-auto space-y-6">
//           <div className="h-44 rounded-2xl bg-white/10 animate-pulse" />
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3].map(i => (
//               <div
//                 key={i}
//                 className="h-[460px] rounded-2xl bg-white/10 animate-pulse"
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {plansError && !plansLoading && (
//         <p className="text-center text-red-400 text-sm">
//           Couldn&apos;t load plans right now. Please refresh the page.
//         </p>
//       )}

//       {!plansLoading && !plansError && (
//         <div className="max-w-5xl mx-auto space-y-6">
//           {/* ── FREE PLAN (full-width) ── */}
//           {freePlan &&
//             (() => {
//               const current = isCurrentPlan(freePlan);
//               const disabled = !!token;

//               return (
//                 <div className="relative rounded-2xl bg-white border border-[#e9e9e9] max-w-fit shadow-sm p-8 md:p-12  mx-auto">
//                   {(current || isFreeUser) && (
//                     <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 bg-[#01503b] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
//                       <Check className="w-3.5 h-3.5" />
//                       Your current plan
//                     </span>
//                   )}

//                   <div className="flex flex-col  md:items-center gap-8 md:gap-12">
//                     {/* Left: identity + CTA */}
//                     <div className="md:w-56 flex-shrink-0 space-y-4">
//                       <div>
//                         <h3
//                           className="text-2xl font-bold text-[#01281e]"
//                           style={{ fontFamily: 'var(--font-fraunces), serif' }}
//                         >
//                           {freePlan.name}
//                         </h3>
//                         <p className="text-sm text-[#8a8f98]">Free forever</p>
//                       </div>

//                       <div className="flex items-baseline gap-1">
//                         <span
//                           className="text-6xl font-bold text-[#01281e] leading-none"
//                           style={{ fontFamily: 'var(--font-fraunces), serif' }}
//                         >
//                           $0
//                         </span>
//                         <span className="text-sm text-[#8a8f98]">/month</span>
//                       </div>

//                       <p className="text-xs text-[#8a8f98]">No card required</p>

//                       <Button
//                         onClick={() => handleSubscribe(freePlan.id)}
//                         disabled={disabled}
//                         className={cn(
//                           'w-full py-5 text-sm font-semibold rounded-md',
//                           disabled
//                             ? 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed shadow-none'
//                             : 'bg-[#B79E6B] hover:bg-[#a8905f] text-white',
//                         )}
//                       >
//                         {token
//                           ? current
//                             ? 'Your Plan'
//                             : 'Free'
//                           : 'Get Started Free'}
//                       </Button>
//                     </div>

//                     {/* Dividers */}
//                     <div className="block w-px self-stretch bg-[#f0f0f0]" />
//                     {/* <div className="md:hidden h-px w-full bg-[#f0f0f0]" /> */}

//                     {/* Right: benefits in 2 columns */}
//                     <div className="flex flex-col gap-x-8 gap-y-3">
//                       {freePlan.benefits.map((b, i) => (
//                         <div key={i} className="flex items-start gap-3">
//                           <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00B977]/10 flex items-center justify-center mt-0.5">
//                             <Check className="w-3 h-3 text-[#00B977] stroke-[3]" />
//                           </div>
//                           <span className="text-sm text-[#444950]">{b}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })()}

//           {/* ── PAID PLANS (grid) ── */}
//           {paidPlans.length > 0 && (
//             <div
//               className={cn(
//                 'grid gap-6',
//                 paidPlans.length === 1 && 'max-w-xs mx-auto',
//                 paidPlans.length === 2 && 'sm:grid-cols-2',
//                 paidPlans.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
//               )}
//             >
//               {paidPlans.map((plan, idx) => {
//                 const price = Number(plan.price);
//                 const { suffix, desc } = billingLabel(plan.billing_period);
//                 const current = isCurrentPlan(plan);
//                 const recommended = idx === recommendedIdx && !current;
//                 const checkoutLoading = loadingPlanId === plan.id;
//                 const disabled = hasActive;
//                 const btnText = hasActive
//                   ? current
//                     ? 'Current Plan'
//                     : 'Subscribed'
//                   : 'Subscribe';

//                 return (
//                   <div
//                     key={plan.id}
//                     className={cn(
//                       'relative flex flex-col rounded-2xl bg-white transition-all duration-200',
//                       recommended
//                         ? 'border-2 border-[#B79E6B] shadow-[0_8px_30px_rgba(183,158,107,0.25)] scale-[1.02]'
//                         : 'border border-[#e9e9e9] shadow-sm hover:shadow-md hover:-translate-y-0.5',
//                     )}
//                   >
//                     {recommended && (
//                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#B79E6B] text-white text-xs font-semibold px-3 py-1 rounded-full shadow whitespace-nowrap">
//                         <ShieldCheck className="w-3.5 h-3.5" />
//                         Most balanced
//                       </div>
//                     )}
//                     {current && (
//                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#01503b] text-white text-xs font-semibold px-3 py-1 rounded-full shadow whitespace-nowrap">
//                         <Check className="w-3.5 h-3.5" />
//                         Your plan
//                       </div>
//                     )}

//                     {/* Card header */}
//                     <div className="p-8 pb-6 border-b border-[#f5f5f5] space-y-5">
//                       <div>
//                         <h3
//                           className="text-xl font-bold text-[#01281e]"
//                           style={{ fontFamily: 'var(--font-fraunces), serif' }}
//                         >
//                           {plan.name}
//                         </h3>
//                         {desc && (
//                           <p className="text-sm text-[#8a8f98] mt-0.5">
//                             {desc}
//                           </p>
//                         )}
//                       </div>

//                       <Button
//                         onClick={() => handleSubscribe(plan.id)}
//                         disabled={disabled || checkoutLoading}
//                         className={cn(
//                           'w-full py-5 text-sm font-semibold rounded-md',
//                           disabled
//                             ? 'bg-[#f7f7f3] text-[#444950] cursor-not-allowed shadow-none'
//                             : 'bg-[#B79E6B] hover:bg-[#a8905f] text-white',
//                         )}
//                       >
//                         {checkoutLoading ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : (
//                           btnText
//                         )}
//                       </Button>

//                       {/* Price — cheaper = visually bigger */}
//                       <div>
//                         <div className="flex items-baseline gap-1.5">
//                           <span
//                             className={cn(
//                               'font-bold text-[#01281e] leading-none',
//                               priceSizeClass(price, paidPrices),
//                             )}
//                             style={{
//                               fontFamily: 'var(--font-fraunces), serif',
//                             }}
//                           >
//                             ${formatPrice(plan.price)}
//                           </span>
//                           {suffix && (
//                             <span className="text-base font-semibold text-[#B79E6B]">
//                               {suffix}
//                             </span>
//                           )}
//                         </div>

//                         {['monthly', 'month'].includes(
//                           plan.billing_period?.toLowerCase(),
//                         ) && (
//                           <p className="text-xs text-[#8a8f98] mt-1">
//                             Total: ${(price * 12).toFixed(2)}/year
//                           </p>
//                         )}
//                         {['yearly', 'year', 'annual'].includes(
//                           plan.billing_period?.toLowerCase(),
//                         ) && (
//                           <p className="text-xs text-[#8a8f98] mt-1">
//                             <sup>†</sup>Total charged up front
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Benefits */}
//                     <div className="p-8 pt-6 flex-1 space-y-3">
//                       {plan.benefits.map((b, i) => (
//                         <div key={i} className="flex items-start gap-3">
//                           <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00B977]/10 flex items-center justify-center mt-0.5">
//                             <Check className="w-3 h-3 text-[#00B977] stroke-[3]" />
//                           </div>
//                           <span className="text-sm text-[#444950]">{b}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

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
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
};

const billingLabel = (period: string): { suffix: string; desc: string } => {
  const p = period?.toLowerCase();
  if (p === 'monthly' || p === 'month')
    return { suffix: '/mo', desc: 'Billed monthly' };
  if (['yearly', 'year', 'annual'].includes(p))
    return { suffix: '/mo', desc: 'Billed annually' };
  if (p === 'forever') return { suffix: '', desc: 'Always free' };
  return { suffix: period ? `/${period}` : '', desc: '' };
};

function priceSizeClass(price: number, allPrices: number[]): string {
  const sorted = [...allPrices].sort((a, b) => a - b);
  const rank = sorted.indexOf(price);
  const classes = ['text-[64px]', 'text-[52px]', 'text-[44px]', 'text-[36px]'];
  return classes[Math.min(rank, classes.length - 1)];
}

/* ─── Shared card shell ─────────────────────────────────── */
interface CardProps {
  plan: DisplayPlan;
  isBadged: boolean;
  badgeText?: string;
  badgeColor?: 'green' | 'gold';
  recommended?: boolean;
  disabled: boolean;
  loading: boolean;
  priceNode: React.ReactNode;
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
  priceNode,
  priceNote,
  btnText,
  onSubscribe,
}: CardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl transition-all duration-300 h-full',
        recommended
          ? 'bg-[#01281e] shadow-[0_24px_64px_rgba(1,40,30,0.40)] z-10' // Removed scale to strictly enforce equal width/height across grid
          : 'bg-white border border-[#e8e8e8] shadow-md hover:shadow-xl hover:-translate-y-1',
      )}
    >
      {/* ── Badge Area (Reserved fixed height to maintain alignment) ── */}
      <div className="px-8 pt-6 h-[56px] flex items-start">
        {isBadged && badgeText && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border',
              recommended
                ? badgeColor === 'gold'
                  ? 'bg-[#B79E6B]/20 text-[#B79E6B] border-[#B79E6B]/30'
                  : 'bg-white/10 text-white border-white/20'
                : badgeColor === 'gold'
                  ? 'bg-[#B79E6B]/10 text-[#B79E6B] border-[#B79E6B]/20'
                  : 'bg-[#01503b]/10 text-[#01503b] border-[#01503b]/20',
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

      {/* ── Top section ── */}
      <div className="px-8 flex flex-col">
        {/* Title & Billing Description container */}
        <div className="min-h-[80px] mb-2">
          <h3
            className={cn(
              'text-xl font-bold mb-1',
              recommended ? 'text-white' : 'text-[#01281e]',
            )}
            style={{ fontFamily: 'var(--font-fraunces), serif' }}
          >
            {plan.name}
          </h3>
          <p
            className={cn(
              'text-sm',
              recommended ? 'text-white/50' : 'text-[#8a8f98]',
            )}
          >
            {billingLabel(plan.billing_period).desc}
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onSubscribe}
          disabled={disabled || loading}
          className={cn(
            'w-full py-5 text-sm font-semibold rounded-lg mb-6',
            disabled
              ? 'bg-[#f0f0f0] text-[#aaa] cursor-not-allowed shadow-none'
              : recommended
                ? 'bg-[#B79E6B] hover:bg-[#a8905f] text-white shadow-md'
                : 'bg-[#01281e] hover:bg-[#014d38] text-white shadow-sm',
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : btnText}
        </Button>

        {/* Price Container (Fixed minimum height ensures dividers align) */}
        <div className="min-h-[104px]">
          {priceNode}
          {priceNote && (
            <p
              className={cn(
                'text-xs mt-1',
                recommended ? 'text-white/40' : 'text-[#bbb]',
              )}
            >
              {priceNote}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className={cn(
          'mx-8 h-px flex-shrink-0',
          recommended ? 'bg-white/10' : 'bg-[#f5f5f5]',
        )}
      />

      {/* Benefits */}
      <div className="p-8 pt-6 flex-1 space-y-3.5">
        {plan.benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                'flex-shrink-0 inline-flex w-5 h-5 rounded-full items-center justify-center mt-0.5',
                recommended ? 'bg-[#00B977]/20' : 'bg-[#00B977]/10',
              )}
            >
              <Check className="w-3 h-3 text-[#00B977] stroke-[2.5]" />
            </span>
            <span
              className={cn(
                'text-sm leading-snug',
                recommended ? 'text-white/75' : 'text-[#555]',
              )}
            >
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────── */
export default function PricingSection() {
  const router = useRouter();
  const token = useAppSelector(state => state.auth.auth.token);

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

  const handleSubscribe = async (planId: string) => {
    if (!token) {
      router.push('/register');
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

  const freePlan = allPlans.find(p => Number(p.price) === 0);
  const paidPlans = allPlans.filter(p => Number(p.price) > 0);

  const isCurrentPlan = (plan: DisplayPlan) =>
    activeSubscription?.plan_id === plan.id &&
    activeSubscription?.status === 'active';

  const hasActive = activeSubscription?.status === 'active' && !!token;
  const isFreeUser = !!token && !hasActive;
  const paidPrices = paidPlans.map(p => Number(p.price));
  const recommendedIdx =
    paidPlans.length >= 3 ? Math.floor(paidPlans.length / 2) : -1;

  return (
    <section className="w-full py-16 px-4 font-[manrope]">
      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-white bg-[#B79E6B] px-4 py-1.5 rounded-full mb-5">
          Membership
        </span>
        <h2
          className="text-4xl md:text-[56px] font-bold text-white mb-4 leading-[1.1]"
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          Built for Boards
        </h2>
        <p className="text-white/70 text-base md:text-lg max-w-md mx-auto leading-relaxed">
          Start with 100 free questions. Upgrade for full access to the question
          bank.
        </p>
      </div>

      {/* ── Skeleton ── */}
      {plansLoading && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="max-w-xs mx-auto h-[420px] rounded-2xl bg-white/10 animate-pulse" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {plansError && !plansLoading && (
        <p className="text-center text-red-400 text-sm">
          Couldn&apos;t load plans right now. Please refresh the page.
        </p>
      )}

      {!plansLoading && !plansError && (
        <div className="max-w-5xl mx-auto space-y-5">
          {/* ── FREE PLAN — centered, same card as paid ── */}
          {freePlan &&
            (() => {
              const current = isCurrentPlan(freePlan);
              const showBadge = current || isFreeUser;

              return (
                <div className="flex justify-center">
                  <div className="w-full max-w-xs">
                    <PlanCard
                      plan={freePlan}
                      isBadged={showBadge}
                      badgeText={showBadge ? 'Your plan' : undefined}
                      badgeColor="green"
                      recommended={false}
                      disabled={!!token}
                      loading={false}
                      btnText={
                        !token
                          ? 'Get Started Free'
                          : current
                            ? 'Current Plan'
                            : 'Free'
                      }
                      onSubscribe={() => handleSubscribe(freePlan.id)}
                      priceNode={
                        <div className="flex items-baseline gap-2 mb-1">
                          <span
                            className="text-[64px] font-bold text-[#01281e] leading-none"
                            style={{
                              fontFamily: 'var(--font-fraunces), serif',
                            }}
                          >
                            $0
                          </span>
                          <span className="text-sm font-semibold text-[#B79E6B]">
                            /mo
                          </span>
                        </div>
                      }
                      priceNote="No card required"
                    />
                  </div>
                </div>
              );
            })()}

          {/* ── PAID PLANS ── */}
          {paidPlans.length > 0 && (
            <div
              className={cn(
                'grid gap-5 items-stretch',
                paidPlans.length === 1 && 'max-w-xs mx-auto',
                paidPlans.length === 2 && 'sm:grid-cols-2 max-w-2xl mx-auto',
                paidPlans.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {paidPlans.map((plan, idx) => {
                const price = Number(plan.price);
                const { suffix } = billingLabel(plan.billing_period);
                const current = isCurrentPlan(plan);
                const recommended = idx === recommendedIdx && !current;
                const checkoutLoading = loadingPlanId === plan.id;
                const disabled = hasActive;

                const isAnnual = ['yearly', 'year', 'annual'].includes(
                  plan.billing_period?.toLowerCase(),
                );
                const isMonthly = ['monthly', 'month'].includes(
                  plan.billing_period?.toLowerCase(),
                );

                const badgeText = recommended
                  ? 'Most popular'
                  : current
                    ? 'Your plan'
                    : undefined;

                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isBadged={!!badgeText}
                    badgeText={badgeText}
                    badgeColor={recommended ? 'gold' : 'green'}
                    recommended={recommended}
                    disabled={disabled}
                    loading={checkoutLoading}
                    btnText={
                      hasActive
                        ? current
                          ? 'Current Plan'
                          : 'Subscribed'
                        : 'Subscribe'
                    }
                    onSubscribe={() => handleSubscribe(plan.id)}
                    priceNode={
                      <div className="flex items-baseline gap-2 flex-wrap mb-1">
                        <span
                          className={cn(
                            'font-bold leading-none',
                            priceSizeClass(price, paidPrices),
                            recommended ? 'text-white' : 'text-[#01281e]',
                          )}
                          style={{ fontFamily: 'var(--font-fraunces), serif' }}
                        >
                          ${formatPrice(plan.price)}
                        </span>
                        {suffix && (
                          <span className="text-sm font-semibold text-[#B79E6B]">
                            {suffix}
                          </span>
                        )}
                      </div>
                    }
                    priceNote={
                      isMonthly
                        ? `$${(price * 12).toFixed(2)} billed yearly`
                        : isAnnual
                          ? 'Total charged up front'
                          : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}