// src/data/categories.js
import {
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  Sparkles,
  Building2,
  HelpCircle,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'road-damage', name: 'Road Damage', icon: Construction },
  { id: 'waste-management', name: 'Waste Management', icon: Trash2 },
  { id: 'water-supply', name: 'Water Supply', icon: Droplets },
  { id: 'street-light', name: 'Street Light', icon: Lightbulb },
  { id: 'water-logging', name: 'Water Logging', icon: Waves },
  { id: 'sanitation', name: 'Sanitation', icon: Sparkles },
  { id: 'public-infrastructure', name: 'Public Infrastructure', icon: Building2 },
  { id: 'other', name: 'Other', icon: HelpCircle },
];