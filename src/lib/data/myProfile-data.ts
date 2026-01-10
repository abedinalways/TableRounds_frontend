
import { ProfileData } from '@/types/profile';

export const profileData: ProfileData = {
  user: {
    name: 'Jordan Nguyen, DMD, MD',
    title: 'Oral and Maxillofacial Surgery, PGY-5 Resident', //this will be linked to Specialty when create profile
    avatar: '/images/dashboard/profile/img01.png',
    location: 'New York, USA',
    jobArea: 'Bellevue Hospital',
    joiningDate: 'March 2021',
    details:
      'Board-certified Oral and Maxillofacial Surgeon with extensive experience in reconstructive surgery, TMJ disorders, and complex facial trauma. Dedicated to advancing surgical techniques through research and education.',
    followers: 523,
    following: 234,
  },
  questionBank: {
    completion: 80,
    ranking: 10,
    correctRate: 90,
    bestTopic: 'Trauma',
  },
  education: [
    {
      title: 'DMD',
      institute:
        "Peterson's Principles, Miloro - Atlas of Oral and Maxillofacial Surgery",
      degree: 'Doctor of Dental Medicine with honors',
      year: '2016',
    },
    {
      title: 'MD',
      institute: 'Harvard Medical School',
      degree: 'Medical Doctor specializing in surgery',
      year: '2018',
    },
    {
      title: 'Residency',
      institute: 'Massachusetts General Hospital',
      degree: 'Oral and Maxillofacial Surgery',
      year: '2020',
    },
  ],

  experience: [
    {
      role: 'Oral & Maxillofacial Surgeon',
      hospital: 'Mayo Clinic',
      location: 'Rochester, MN',
      period: '2019 - Present',
      specialty:
        'Practicing oral and maxillofacial surgery with focus on reconstructive procedures and TMJ surgery',
    },
    {
      role: 'Chief Resident',
      hospital: 'Harvard Hospital',
      location: 'Boston-900, MA',
      period: '2018 - 2020',
      specialty:
        'Led a team of residents in managing complex maxillofacial trauma cases and surgical education',
    },
  ],

  publications: [
    {
      title: 'Novel Approaches to TMJ Reconstruction',
      articleLink: 'https://www.ncbi.nlm.nih.gov/books/NBK481948/',
      author: ' Jordan Nguyen, DMD, MD',
      year: '2023',
    },
    {
      title: 'Maxillofacial Trauma Surgery',
      articleLink: 'https://www.ncbi.nlm.nih.gov/books/NBK589654/',
      author: 'Wiley-Blackwell',
      year: '2021',
    },
  ],

  skills: [
    'Reconstructive Surgery',
    'Orthognathic Surgery',
    'Dental Implants',
    'Facial Cosmetic Surgery',
    'Sleep Apnea Surgery',
  ],
};
