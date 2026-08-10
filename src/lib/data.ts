export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Pricing {
  amount: number | null;
  currency: string;
  status: 'listed' | 'not_listed';
  lastUpdated?: string;
}

export interface Center {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pricing: Pricing;
  availability: any[];
  services: string[];
  rating: number;
  reviews: number;
}

export const cities: City[] = [
  {
    "id": "city-amritsar",
    "name": "Amritsar",
    "state": "Punjab",
    "lat": 31.6340,
    "lng": 74.8723,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/4610a0ae-ad80-402c-9edd-d66cd9a86937-harry-singh-mTBc_h93o-U-unsplash.jpg"
  },
  {
    "id": "city-bangalore",
    "name": "Bangalore",
    "state": "Karnataka",
    "lat": 12.9716,
    "lng": 77.5946,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/f217dc7f-124d-4e8a-a020-40f04ca16c6c-mahadev-ittina-0FXjIXhHSkA-unsplash.jpg"
  },
  {
    "id": "city-gurugram",
    "name": "Gurugram",
    "state": "Haryana",
    "lat": 28.4595,
    "lng": 77.0266,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/b2b53434-32a4-4ce6-9eb6-d464be673d49-Gurgaon.jpg"
  },
  {
    "id": "city-katra",
    "name": "Katra",
    "state": "Jammu and Kashmir",
    "lat": 32.9912,
    "lng": 74.9317,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/c5b4c798-659f-448e-8f3e-2efbf6c01928-dishant-thapa-K0s4LcHtOPQ-unsplash.jpg"
  },
  {
    "id": "city-navi-mumbai",
    "name": "Navi Mumbai",
    "state": "Maharashtra",
    "lat": 19.0330,
    "lng": 73.0297,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/77c81566-5f7b-42f4-a053-d94ff6072210-mumbai.jpg"
  },
  {
    "id": "city-new-delhi",
    "name": "New Delhi",
    "state": "Delhi",
    "lat": 28.6139,
    "lng": 77.2090,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/ad351745-2091-4830-b688-1271a20d151a-delhi.jpg"
  },
  {
    "id": "city-prayagraj",
    "name": "Prayagraj",
    "state": "Uttar Pradesh",
    "lat": 25.4358,
    "lng": 81.8463,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/e1ec75ad-dd1e-4409-afe3-006444f6601f-prayagraj.jpg"
  },
  {
    "id": "city-udaipur",
    "name": "Udaipur",
    "state": "Rajasthan",
    "lat": 24.5854,
    "lng": 73.6811,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/715886dd-b58b-4d9e-a84f-aac0391d7ffd-udaipur.jpg"
  },
  {
    "id": "city-ujjain",
    "name": "Ujjain",
    "state": "Madhya Pradesh",
    "lat": 23.1765,
    "lng": 75.7885,
    "image": "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/9c2670d4-c558-4aa3-929c-3349b62291e5-ujjain.jpg"
  }
];

export const services: Service[] = [
  {
    "id": "svc-hemodialysis",
    "name": "Hemodialysis",
    "description": "Standard hemodialysis treatment using state-of-the-art machines."
  },
  {
    "id": "svc-hdf",
    "name": "Hemodiafiltration (HDF)",
    "description": "Advanced dialysis combining diffusion and convection for better clearance."
  },
  {
    "id": "svc-isolation",
    "name": "Isolation Dialysis",
    "description": "Dedicated machines and space for Hep B/C positive patients."
  },
  {
    "id": "svc-travel",
    "name": "Travel Patient Support",
    "description": "Specialized coordination for out-of-town patients and seamless scheduling."
  },
  {
    "id": "svc-emergency",
    "name": "Emergency Support",
    "description": "ICU backup and emergency response capabilities on-site."
  },
  {
    "id": "svc-weekend",
    "name": "Weekend Availability",
    "description": "Flexible scheduling including Saturdays and Sundays."
  }
];

export const centers: Center[] = [
  {
    "id": "c-001",
    "name": "Amritsar Kidney Care & Dialysis Center",
    "city": "Amritsar",
    "state": "Punjab",
    "address": "123 Medical Enclave, Amritsar, Punjab 143001",
    "pricing": {
      "amount": 2500,
      "currency": "INR",
      "status": "listed",
      "lastUpdated": "10 Aug 2026"
    },
    "availability": [
      { "date": "10 Aug", "morning": "Available", "afternoon": "Limited", "evening": "Unavailable" }
    ],
    "services": ["svc-hemodialysis", "svc-travel", "svc-isolation"],
    "rating": 4.8,
    "reviews": 124
  },
  {
    "id": "c-002",
    "name": "Bangalore Central Nephrology",
    "city": "Bangalore",
    "state": "Karnataka",
    "address": "45 MG Road, Bangalore, Karnataka 560001",
    "pricing": {
      "amount": 3200,
      "currency": "INR",
      "status": "listed",
      "lastUpdated": "08 Aug 2026"
    },
    "availability": [
      { "date": "10 Aug", "morning": "Limited", "afternoon": "Available", "evening": "Available" }
    ],
    "services": ["svc-hemodialysis", "svc-hdf", "svc-travel", "svc-emergency"],
    "rating": 4.9,
    "reviews": 312
  }
];
