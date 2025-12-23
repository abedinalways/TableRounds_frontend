'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

/* ------------------ Validation Schema ------------------ */
const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message is required'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function GetInTouch() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string);
  }, []);
 
 const onSubmit = async (data: ContactFormData) => {
   try {
     const result = await emailjs.send(
       process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
       {
         name: data.name,
         email: data.email,
         message: data.message,
       }
     );

     console.log('Email sent:', result.text);
     reset();
   } catch (error) {
     console.error('EmailJS error:', error);
     alert('Failed to send message. Please try again.');
   }
 };



  return (
    <section className="w-full bg-[#f9f9f4] py-20 mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold text-[#014737] mb-2">
          Get in Touch
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Have questions or ideas? Fill out the form and we’ll respond soon.
        </p>

        <Card className="bg-gradient-to-r from-[#014737] to-[#0a8f6a] p-8 rounded-xl shadow-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 max-w-3xl"
          >
            <div>
              <label className="text-white text-sm mb-1 block">Name*</label>
              <Input
                placeholder="Enter your name"
                {...register('name')}
                className="bg-white/90"
              />
              {errors.name && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-white text-sm mb-1 block">Email*</label>
              <Input
                placeholder="Enter your email address"
                {...register('email')}
                className="bg-white/90"
              />
              {errors.email && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-white text-sm mb-1 block">Message*</label>
              <Textarea
                rows={4}
                placeholder="Write your message"
                {...register('message')}
                className="bg-white/90"
              />
              {errors.message && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#d4b06a] hover:bg-[#c9a457] text-black px-8"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
