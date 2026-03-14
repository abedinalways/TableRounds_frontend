'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { CheckCircle2, CloudUpload } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Link from 'next/link';
import { Country, State } from 'country-state-city';

import { toast } from 'sonner';



interface SignUpFormData {
  fullName: string;
  credentials: string;
  email: string;
  createPassword: string;
  confirmPassword: string;
  yearInTraining: string;
  specialty: string;
  country: string;
  state: string;
  location: string;
  currentPractice: string;
  briefBio: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  agreeToTerms: boolean;
}

interface SignUpFormProps {
  onSubmit?: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function SignUpForm({
  onSubmit,
  onCancel,
  
  isLoading = false,
}: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    credentials: '',
    email: '',
    createPassword: '',
    confirmPassword: '',
    yearInTraining: '',
    specialty: '',
    country: '',
    state: '',
    location: '',
    currentPractice: '',
    briefBio: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    agreeToTerms: false,
  });
  // const [registerUser, { isLoading }] = useRegisterNewUserMutation();

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | boolean,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (type: 'photo' | 'document', file: File | null) => {
    if (type === 'photo') {
      setProfilePhoto(file);
    } else {
      setVerificationDoc(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!formData.credentials.trim())
      newErrors.credentials = 'Credentials is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format';

    if (!formData.createPassword)
      newErrors.createPassword = 'Password is required';
    else if (formData.createPassword.length < 8)
      newErrors.createPassword = 'Password must be at least 8 characters';

    if (formData.createPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.specialty.trim())
      newErrors.specialty = 'Specialty is required';

    // if (!formData.agreeToTerms) {
    //   newErrors.agreeToTerms = 'You must agree to the terms';
    // }

    if (!profilePhoto) {
      toast.error('Profile photo is required');
      return false;
    }

    if (!verificationDoc) {
      toast.error('Verification document is required');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
   if (!validateForm()) return;

   const payload = {
     name: formData.fullName,
     email: formData.email,
     password: formData.createPassword,
     credentials: formData.credentials,
     training_practice: formData.yearInTraining,
     address: formData.location,
     current_practice: formData.currentPractice,
     bio: formData.briefBio,
     specialty: formData.specialty,
     instagram: formData.instagramUrl || undefined,
     linkedin: formData.linkedinUrl || undefined,
     twitter_x: formData.twitterUrl || undefined,
     facebook: formData.facebookUrl || undefined,
     avatar: profilePhoto,
     verification_doc: verificationDoc,
     type: 'user',
   };

   await onSubmit?.(payload);
 };
  // console.log(handleSubmit, 'mjcsdcsd');

  return (
    <div className="z-40  font-[manrope] py-6 mb-12">
      <div
        className="custom-container p-6 md:p-8 mx-auto gradient-bg rounded-md backdrop-blur  
opacity-xl font-[manrope]"
      >
        <div className="md:flex justify-between gap-10">
          {/* Left Column - Credentials */}
          <div className="space-y-1   rounded-lg">
            <div className="space-y-[20px]">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Name<span className="text-red-600">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 rounded-[8px] md:w-[644px] md:h-[61px] placeholder:text-[18px]"
                />
                {errors.fullName && (
                  <p className="text-red-300 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="credentials"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Credentials <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="credentials"
                  placeholder="i.e. DDS, DMD, MD, Student"
                  value={formData.credentials}
                  onChange={e =>
                    handleInputChange('credentials', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
                {errors.credentials && (
                  <p className="text-red-300 text-xs mt-1">
                    {errors.credentials}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Email (Institutional Preferred){' '}
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="createPassword"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Create Password <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="createPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.createPassword}
                  onChange={e =>
                    handleInputChange('createPassword', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
                {errors.createPassword && (
                  <p className="text-red-300 text-xs mt-1">
                    {errors.createPassword}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Confirm Password <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={e =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D]  h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="yearInTraining"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Year in Training/Practice
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="yearInTraining"
                  placeholder="Student, PGY, Attending"
                  value={formData.yearInTraining}
                  onChange={e =>
                    handleInputChange('yearInTraining', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              {/* specialty */}
              <div>
                <Label
                  htmlFor="Specialty"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Specialty <span className="text-red-600">*</span>
                </Label>

                <Select
                  value={formData.specialty}
                  onValueChange={value => handleInputChange('specialty', value)}
                >
                  <SelectTrigger
                    size="xl"
                    className="mt-2  bg-[#1C765E] border-none md:p-4 rounded-[8px] cursor-pointer text-white text-[18px]! [&>span]:text-white [&_[data-placeholder]]:text-white [&_svg]:opacity-100 placeholder:text-[18px] rounded-[8px] md:w-[644px] w-[225px]"
                  >
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#1C765E] border-none text-white">
                    <SelectItem
                      className="text-white"
                      value="Oral and Maxillofacial Surgery"
                    >
                      Oral and Maxillofacial Surgery
                    </SelectItem>
                    <SelectItem className="text-white" value="Plastic Surgery">
                      Plastic Surgery
                    </SelectItem>
                    <SelectItem
                      className="text-white"
                      value="Otorhinolaryngology Surgery"
                    >
                      Otorhinolaryngology
                    </SelectItem>
                    <SelectItem className="text-white" value="Dentist">
                      Dentistry
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors.specialty && (
                  <p className="text-red-300 text-xs mt-1">
                    {errors.specialty}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Location <span className="text-red-600">*</span>
                </Label>

                {/* Country */}
                <Select
                  value={formData.country}
                  onValueChange={value => {
                    handleInputChange('country', value);
                    handleInputChange('state', ''); // reset state
                  }}
                >
                  <SelectTrigger className="mt-2 bg-[#1C765E] border-none rounded-[8px] text-white md:w-[644px] py-6">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#1C765E] text-white max-h-[300px]">
                    {Country.getAllCountries().map(country => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* State */}
                <Select
                  value={formData.state}
                  onValueChange={value => handleInputChange('state', value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="mt-3 bg-[#1C765E] border-none rounded-[8px] text-white md:w-[644px] py-6">
                    <SelectValue placeholder="Select state / province" />
                  </SelectTrigger>

                  <SelectContent className="bg-[#1C765E] text-white max-h-[300px] py-4">
                    {State.getStatesOfCountry(formData.country).map(state => (
                      <SelectItem key={state.isoCode} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="location"
                  placeholder="Enter your city, state, and country"
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  className="mt-6 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>
              {/* current practice */}
              <div>
                <Label
                  htmlFor="currentPractice"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Current Practice<span className="text-red-600">*</span>
                </Label>
                <Input
                  id="currentPractice"
                  placeholder="Name of your residency, hospital, or private practice"
                  value={formData.currentPractice}
                  onChange={e =>
                    handleInputChange('currentPractice', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="briefBio"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Brief Bio
                </Label>
                <Input
                  id="briefBio"
                  placeholder="Enter a brief bio about yourself"
                  value={formData.briefBio}
                  onChange={e => handleInputChange('briefBio', e.target.value)}
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="instagram"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  placeholder="Personal link"
                  value={formData.instagramUrl}
                  onChange={e =>
                    handleInputChange('instagramUrl', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="linkedin"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  placeholder="Personal link"
                  value={formData.linkedinUrl}
                  onChange={e =>
                    handleInputChange('linkedinUrl', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="twitter"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  placeholder="Personal link"
                  value={formData.twitterUrl}
                  onChange={e =>
                    handleInputChange('twitterUrl', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="facebook"
                  className="text-white text-sm md:text-[18px] font-bold"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  placeholder="Personal link"
                  value={formData.facebookUrl}
                  onChange={e =>
                    handleInputChange('facebookUrl', e.target.value)
                  }
                  className="mt-1 bg-[#1C765E] border-none text-white text-[18px]! placeholder:text-[#F9FAFB7D] h-9 placeholder:text-[18px] rounded-[8px] md:w-[644px] md:h-[61px]"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Upload & Verification */}
          <div className="space-y-6 md:p-6 flex flex-col ">
            {/* Terms and Submit */}
            <div className="mt-6 flex  items-center   gap-4 mx-6 space-x-6">
              {/* submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#B79E6B] text-white hover:bg-[#a08c5f] transition-colors rounded-[8px] px-[24px] py-[14px]  w-full  h-[54px] font-medium cursor-pointer"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
              {/* <Link href='/login'>
                  <button
                    type="button"
                    className="bg-white text-[#b79e6b] font-medium    hover:bg-white transition-colors rounded-[8px] px-[24px] py-[14px] w-[168px] h-[54px] cursor-pointer"
                    onClick={onCancel}
                  >
                    Sign In
                  </button>
                </Link> */}
            </div>
            <div className=" border-none mt-2">
              <CardHeader>
                <CardTitle className="text-white text-sm md:text-[18px]">
                  Profile Photo <span className="text-red-600">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-[#22BA92] bg-[#1C765E] rounded-lg py-8  text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <CloudUpload className="w-8 h-8 text-teal-700" />
                    </div>
                    <div className="text-white">
                      <p className="text-white text-md md:text-[20px] font-semibold">
                        Upload your professional headshot
                      </p>
                      <p className="text-xs md:text-sm text-teal-200">
                        Supported format: JPG / PNG (up to 5 mb)
                      </p>
                    </div>
                    <label htmlFor="profilePhoto">
                      <Button
                        type="button"
                        className="bg-[#B79E6B] text-white w-fit h-10 hover:bg-[#a08c5f] transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] cursor-pointer"
                        asChild
                      >
                        <span>Choose File</span>
                      </Button>
                      <input
                        id="profilePhoto"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e =>
                          handleFileUpload('photo', e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {profilePhoto && (
                      <p className="text-teal-100 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {profilePhoto.name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="mt-2 border-none">
              <CardHeader>
                <CardTitle className="text-white text-sm md:text-[18px]">
                  Profile Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-[#22BA92] bg-[#1C765E] rounded-lg py-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <CloudUpload className="w-8 h-8 text-teal-700" />
                    </div>
                    <div className="text-white">
                      <p className="text-white text-md md:text-[20px] font-semibold">
                        Upload verification document
                      </p>
                      <p className="text-xs md:text-sm text-teal-200">
                        Supported format: JPG / PNG (up to 5 mb)
                      </p>
                    </div>
                    <label htmlFor="verificationDoc">
                      <Button
                        type="button"
                        className="bg-[#B79E6B] text-white w-fit h-10 hover:bg-[#a08c5f] transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] cursor-pointer"
                        asChild
                      >
                        <span>Choose File</span>
                      </Button>
                      <input
                        id="verificationDoc"
                        type="file"
                        className="hidden"
                        onChange={e =>
                          handleFileUpload(
                            'document',
                            e.target.files?.[0] || null,
                          )
                        }
                      />
                    </label>
                    {verificationDoc && (
                      <p className="text-teal-100 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {verificationDoc.name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>

            <Card className="bg-[#F9F9F5] border-[#EFE8E8] mx-[22px]">
              <CardHeader>
                <CardTitle className="text-teal-900 font-bold">
                  Verify your identity
                </CardTitle>
                <CardDescription>
                  To keep TableRounds limited to real clinicians, please verify
                  your identity with one of the following:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Image
                    src="/images/auth/stethoscope.png"
                    width={20}
                    height={20}
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-sm">
                    Sign up with your institutional email, or
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Image
                    src="/images/auth/stethoscope.png"
                    width={20}
                    height={20}
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-sm">
                    Upload a clear photo of your school/hospital ID, or
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Image
                    src="/images/auth/stethoscope.png"
                    width={20}
                    height={20}
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-sm">
                    Send a direct message to{' '}
                    <Link href="https://instagram.com/tablerounds.oms">
                      <span className="text-yellow-600 cursor-pointer font-bold hover:underline">
                        @TableRounds.OMS
                      </span>
                    </Link>{' '}
                    on Instagram from your personal account
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Image
                    src="/images/auth/stethoscope.png"
                    width={20}
                    height={20}
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-sm">
                    All verification documents are encrypted and used only for
                    identity verification. Each account is personally reviewed
                    and approved by an admin.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
