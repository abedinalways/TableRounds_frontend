import { Specialty } from '@/types/specialty';

export const mockSpecialties: Specialty[] = [
  {
    id: '1',
    specialty_name: 'OMS',
    specialty_banner_img: '/images/osm/banner.png',
    brand_img: '/images/osm/osm.png',
    topics: [
      {
        topic_name: 'Anesthesia/Medicine',
        topic_img: '/images/specialty/img02.png',
      },
      { topic_name: 'Cancer', topic_img: '/images/specialty/img01.png' },
      {
        topic_name: 'Cleft/Craniofacial',
        topic_img: '/images/specialty/img03.png',
      },
      { topic_name: 'Cosmetics', topic_img: '/images/specialty/img04.png' },
      { topic_name: 'Dentoalveolar', topic_img: '/images/specialty/img05.png' },
      { topic_name: 'Implants', topic_img: '/images/specialty/img06.png' },
      { topic_name: 'Orthognathic', topic_img: '/images/specialty/img07.png' },
      { topic_name: 'Pathology', topic_img: '/images/specialty/img08.png' },
      {
        topic_name: 'Reconstruction',
        topic_img: '/images/specialty/img09.png',
      },
      { topic_name: 'TMJ', topic_img: '/images/specialty/img10.png' },
      { topic_name: 'Trauma', topic_img: '/images/specialty/img11.png' },
    ],
  },
  {
    id: '2',
    specialty_name: 'Dentistry',
    specialty_banner_img: '/images/osm/banner.png',
    brand_img: '/images/osm/osm.png',
    topics: [
      { topic_name: 'Restorative', topic_img: '/images/specialty/img01.png' },
      { topic_name: 'Endodontics', topic_img: '/images/specialty/img02.png' },
      { topic_name: 'Periodontics', topic_img: '/images/specialty/img03.png' },
      {
        topic_name: 'Prosthodontics',
        topic_img: '/images/specialty/img04.png',
      },
      {
        topic_name: 'Pediatric Dentistry',
        topic_img: '/images/specialty/img05.png',
      },
    ],
  },
  {
    id: '3',
    specialty_name: 'Medicine',
    specialty_banner_img: '/images/osm/banner.png',
    brand_img: '/images/osm/TR Emergency Medicine logo.png',
    topics: [
      { topic_name: 'Cardiology', topic_img: '/images/specialty/img06.png' },
      {
        topic_name: 'Gastroenterology',
        topic_img: '/images/specialty/img07.png',
      },
      { topic_name: 'Neurology', topic_img: '/images/specialty/img08.png' },
      { topic_name: 'Pulmonology', topic_img: '/images/specialty/img09.png' },
      { topic_name: 'Rheumatology', topic_img: '/images/specialty/img10.png' },
      {
        topic_name: 'Infectious Disease',
        topic_img: '/images/specialty/img11.png',
      },
    ],
  },
];

let mockStore: Specialty[] = [...mockSpecialties];

export const mockSpecialtyService = {
  getAll: () => ({
    data: {
      data: mockStore,
      meta: { total: mockStore.length },
    },
  }),

  getByName: (name: string) => {
    if (!name) return { data: null };
    const normalized = name.toLowerCase().replace(/[\s-]+/g, '');
    const found = mockStore.find(
      s => s.specialty_name.toLowerCase().replace(/[\s-]+/g, '') === normalized,
    );
    if (found) {
      return { data: found };
    }
    return { data: null };
  },

   create: (data: Omit<Specialty, 'id' | '_id'>) => {
    const newSpecialty: Specialty = {
      id: `mock-${Date.now()}`,
      specialty_name: data.specialty_name,
      specialty_banner_img: data.specialty_banner_img,
      brand_img: data.brand_img,
      topics: data.topics ?? [],
    };
    mockStore = [...mockStore, newSpecialty];
    return { data: newSpecialty };
  },

  update: (id: string, data: Partial<Specialty>) => {
    const index = mockStore.findIndex(s => s.id === id || s._id === id);
    if (index >= 0) {
      mockStore = mockStore.map((s, i) =>
        i === index ? { ...s, ...data } : s,
      );
      return { data: mockStore[index] };
    }
    return { data: null };
  },

  delete: (id: string) => {
    mockStore = mockStore.filter(s => s.id !== id && s._id !== id);
    return { data: { message: 'Deleted successfully' } };
  },

  reset: () => {
    mockStore = [...mockSpecialties];
  },
};
