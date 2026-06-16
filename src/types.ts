export interface JournalEntry {
  id: string;
  date: string;
  category: 'general' | 'watering' | 'repotting' | 'fertilizing' | 'new-growth' | 'pest-treatment';
  title: string;
  notes: string;
  imageUrl?: string;
  plantHeight?: number; // in cm
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  vitality: number;
  healthStatus: 'Healthy' | 'Needs Attention' | 'Excellent';
  light: string;
  watering: string;
  temp: string;
  habitat: 'Indoor' | 'Outdoor';
  tags?: string[];
  spaceId?: string;
  // New features for care tracking and journal records
  journals?: JournalEntry[];
  lastWateredDate?: string; // YYYY-MM-DD
  wateringIntervalDays?: number; // active watering interval in days
  lastFertilizedDate?: string; // YYYY-MM-DD
  fertilizerIntervalDays?: number; // e.g. 14, 30 days, or 0 if none
  lastRepottedDate?: string; // YYYY-MM-DD
  repotIntervalMonths?: number;
}

export interface Task {
  id: string;
  type: 'water' | 'mist' | 'feed';
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface Space {
  id: string;
  name: string;
  plantCount: number;
  status: 'Lush' | 'Stable' | 'Dry Soil';
  image: string;
  alert?: string;
  featuresImages?: string[];
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: string;
}
