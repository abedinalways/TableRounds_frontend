'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  BackendPlanData,
  PlanType,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} from '@/app/redux/api/financialApi';

interface UpdatePlansFormProps {
  editingPlan: BackendPlanData | null;
  onSuccess: () => void;
}

export default function UpdatePlansForm({
  editingPlan,
  onSuccess,
}: UpdatePlansFormProps) {
  const [createPlan, { isLoading: isCreating }] =
    useCreateSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateSubscriptionPlanMutation();

 
  const [planName, setPlanName] = useState('New Custom Plan');
  const [planType, setPlanType] = useState<PlanType>(PlanType.MONTHLY);
  const [price, setPrice] = useState('45.00');
  const [period, setPeriod] = useState('monthly');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    if (editingPlan) {
      setPlanName(
        editingPlan.name ||
          (editingPlan.type === PlanType.PAY_AS_YOU_GO
            ? 'Pay-As-You-Go'
            : 'Monthly Professional'),
      );
      setPlanType(editingPlan.type);
      setPrice(editingPlan.price.toString());
      setPeriod(editingPlan.billing_period);
      setBenefits(editingPlan.benefits || []);
      setIsPopular(editingPlan.isPopular || false);
    } else {
      setPlanName(
        planType === PlanType.PAY_AS_YOU_GO
          ? 'Pay-As-You-Go'
          : 'Monthly Professional',
      );
      setPlanType(PlanType.MONTHLY);
      setPrice('45.00');
      setPeriod('monthly');
      setBenefits(['One Official Memorial Notice', 'Charity Integration']);
      setIsPopular(false);
    }
  }, [editingPlan]);

 
  const handleTypeChange = (type: PlanType) => {
    setPlanType(type);
    if (!editingPlan) {
      setPlanName(
        type === PlanType.PAY_AS_YOU_GO
          ? 'Pay-As-You-Go'
          : 'Monthly Professional',
      );
    }
  };

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleSave = async () => {
    const finalPeriod = planType === PlanType.PAY_AS_YOU_GO ? 'post' : period;

    
    const payload = {
      name: planName,
      type: planType,
      price: parseFloat(price) || 0,
      billing_period: finalPeriod,
      isPopular,
      benefits: benefits, 
    };

    try {
      if (editingPlan) {
        await updatePlan({ id: editingPlan.id, body: payload }).unwrap();
        toast.success('Plan successfully updated');
      } else {
        await createPlan(payload).unwrap();
        toast.success('Plan successfully created');
      }
      onSuccess();
    } catch (err) {
      toast.error('Something went wrong. Please check fields.');
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-[540px] font-[manrope] space-y-6">
      {/* Plan Name Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500">Plan Name</label>
        <input
          type="text"
          value={planName}
          onChange={e => setPlanName(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#01503b]"
          placeholder="e.g. Standard Plan"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label
          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${planType === PlanType.PAY_AS_YOU_GO ? 'border-[#01503b] bg-[#f4f9f1]/50' : 'border-gray-200'}`}
        >
          <input
            type="radio"
            checked={planType === PlanType.PAY_AS_YOU_GO}
            onChange={() => handleTypeChange(PlanType.PAY_AS_YOU_GO)}
            className="mt-1 accent-[#01503b]"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">Pay-As-You-Go</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Charge a one-time fee
            </p>
          </div>
        </label>
        <label
          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${planType === PlanType.MONTHLY ? 'border-[#01503b] bg-[#f4f9f1]/50' : 'border-gray-200'}`}
        >
          <input
            type="radio"
            checked={planType === PlanType.MONTHLY}
            onChange={() => handleTypeChange(PlanType.MONTHLY)}
            className="mt-1 accent-[#01503b]"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">
              Monthly Professional
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Charge an ongoing fee
            </p>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500">Price</label>
          <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#01503b] transition-all">
            <span className="text-sm text-gray-500 mr-1">
              <img
                width="16"
                height="16"
                src="https://img.icons8.com/material-outlined/48/us-dollar--v1.png"
                alt="us-dollar--v1"
              />{' '}
            </span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full text-sm focus:outline-none bg-transparent"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500">
            Billing Period
          </label>
          <select
            disabled={planType === PlanType.PAY_AS_YOU_GO}
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white focus:outline-none focus:border-[#01503b] transition-all disabled:bg-gray-100"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly (3 Months)</option>
            <option value="6_months">6 Months</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPopular"
          checked={isPopular}
          onChange={e => setIsPopular(e.target.checked)}
          className="accent-[#01503b] w-4 h-4"
        />
        <label
          htmlFor="isPopular"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Mark as Popular
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          Benefits
        </label>
        <div className="space-y-2">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 bg-white"
            >
              <span className="text-sm text-gray-700 font-medium">
                {benefit}
              </span>
              <button
                type="button"
                onClick={() =>
                  setBenefits(benefits.filter((_, i) => i !== idx))
                }
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddBenefit} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Add benefits"
            value={newBenefit}
            onChange={e => setNewBenefit(e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#01503b]"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#e2f0db] hover:bg-[#cbdcc3] text-[#01503b] rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onSuccess}
          className="w-full py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-[#f4f9f1]/40 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isCreating || isUpdating}
          className="w-full py-3 gradient-bg hover:bg-[#01503b] rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {(isCreating || isUpdating) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {editingPlan ? 'Save Changes' : 'Create Plan'}
        </button>
      </div>
    </div>
  );
}
