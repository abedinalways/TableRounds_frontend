// 'use client';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card } from '@/components/ui/card';
// import Btn from '@/components/reusable/button/Btn';

// const contactSchema = z.object({
//   name: z.string().min(2, 'Name is required'),
//   email: z.string().email('Invalid email address'),
//   message: z.string().min(5, 'Message is required'),
// });

// type ContactFormData = z.infer<typeof contactSchema>;

// export default function ContactForm() {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<ContactFormData>({
//     resolver: zodResolver(contactSchema),
//   });

//   const onSubmit = async (_data: ContactFormData) => {
//     await new Promise(res => setTimeout(res, 800));
//     toast.success('Message sent successfully');
//     reset();
//   };

//   return (
//     <Card className="background p-8 rounded-xl shadow-lg max-w-full md:px-25 ">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-5xl">
//         {/* Name */}
//         <div>
//           <label className="text-white text-sm md:text-[18px] mb-1 block">
//             Name <span className="text-red-600">*</span>
//           </label>
//           <Input
//             placeholder="Enter your name"
//             {...register('name')}
//             className="bg-[#1D886B] px-[12px] py-[16px] placeholder:text-[#f9f9f5] placeholder:text-[12px] rounded-[8px] border-none shadow-lg text-white md:h-[60px] w-full"
//           />
//           {errors.name && (
//             <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="text-white text-sm md:text-[18px] mb-1 block">
//             Email <span className="text-red-600">*</span>
//           </label>
//           <Input
//             placeholder="Enter your email address"
//             {...register('email')}
//             className="bg-[#1D886B] px-[12px] py-[16px] placeholder:text-[#f9f9f5] placeholder:text-[12px] rounded-[8px] border-none shadow-lg text-white md:h-[60px] w-full"
//           />
//           {errors.email && (
//             <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         {/* Message */}
//         <div>
//           <label className="text-white text-sm md:text-[18px] mb-1 block">
//             Message <span className="text-red-600">*</span>
//           </label>
//           <Textarea
//             rows={4}
//             placeholder="Write your message"
//             {...register('message')}
//             className="bg-[#1D886B] rounded-[8px] border-none placeholder:text-[#f9f9f5] placeholder:text-[12px] shadow-lg text-white"
//           />
//           {errors.message && (
//             <p className="text-red-300 text-xs mt-1">
//               {errors.message.message}
//             </p>
//           )}
//         </div>

//         <Btn
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-[#B79E6B] text-white hover:bg-[#a08c5f] rounded-[8px] w-full md:w-[190px] h-[54px] text-sm md:text-[16px]"
//         >
//           {isSubmitting ? 'Sending...' : 'Submit'}
//         </Btn>
//       </form>
//     </Card>
//   );
// }

'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Btn from '@/components/reusable/button/Btn';
import { usePostContactMessageMutation } from '@/app/redux/api/contactApi';



const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message is required'),
  honey: z.string().optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [postContact, { isLoading }] = usePostContactMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    
    if (data.honey) {
      return;
    }

    try {
     
      const { honey, ...actualData } = data;

      const res = await postContact(actualData).unwrap();

      if (res.success) {
        toast.success(res.message || 'Message sent successfully!', {
          description: 'We will get back to you as soon as possible.',
        });
        reset();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || 'Failed to send message. Please try again.',
      );
    }
  };

  return (
    <Card className="background p-8 rounded-xl shadow-lg max-w-full md:px-25 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-5xl">
        
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            {...register('honey')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name */}
        <div>
          <label className="text-white text-sm md:text-[18px] mb-1 block">
            Name <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder="Enter your name"
            {...register('name')}
            className="bg-[#1D886B] px-[12px] py-[16px] placeholder:text-[#f9f9f5] placeholder:text-[12px] rounded-[8px] border-none shadow-lg text-white md:h-[60px] w-full"
          />
          {errors.name && (
            <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-white text-sm md:text-[18px] mb-1 block">
            Email <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder="Enter your email address"
            {...register('email')}
            className="bg-[#1D886B] px-[12px] py-[16px] placeholder:text-[#f9f9f5] placeholder:text-[12px] rounded-[8px] border-none shadow-lg text-white md:h-[60px] w-full"
          />
          {errors.email && (
            <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-white text-sm md:text-[18px] mb-1 block">
            Subject
          </label>
          <Input
            placeholder="Enter the subject"
            {...register('subject')}
            className="bg-[#1D886B] px-[12px] py-[16px] placeholder:text-[#f9f9f5] placeholder:text-[12px] rounded-[8px] border-none shadow-lg text-white md:h-[60px] w-full"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-white text-sm md:text-[18px] mb-1 block">
            Message <span className="text-red-600">*</span>
          </label>
          <Textarea
            rows={4}
            placeholder="Write your message"
            {...register('message')}
            className="bg-[#1D886B] rounded-[8px] border-none placeholder:text-[#f9f9f5] placeholder:text-[12px] shadow-lg text-white"
          />
          {errors.message && (
            <p className="text-red-300 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Btn
          type="submit"
          disabled={isLoading}
          className="bg-[#B79E6B] text-white hover:bg-[#a08c5f] rounded-[8px] w-full md:w-[190px] h-[54px] text-sm md:text-[16px]"
        >
          {isLoading ? 'Sending...' : 'Submit'}
        </Btn>
      </form>
    </Card>
  );
}