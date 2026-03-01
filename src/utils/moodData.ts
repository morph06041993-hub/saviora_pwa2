import React from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

// --- ИКОНКИ ГЛАВНЫХ КАТЕГОРИЙ ---
import CloudIcon from '@mui/icons-material/Cloud';       // Тяжесть
import TsunamiIcon from '@mui/icons-material/Tsunami';   // Шторм
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Огонь
import SpaIcon from '@mui/icons-material/Spa';           // Ясность
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'; // Полет

// --- ИКОНКИ ПОДКАТЕГОРИЙ ---
// 1. Тяжесть
import WaterDropIcon from '@mui/icons-material/WaterDrop'; 
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert'; 
import CropFreeIcon from '@mui/icons-material/CropFree'; 
import PersonOffIcon from '@mui/icons-material/PersonOff'; 
import BlockIcon from '@mui/icons-material/Block'; 

// 2. Шторм
import WavesIcon from '@mui/icons-material/Waves'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; 
import CycloneIcon from '@mui/icons-material/Cyclone'; 
import CompressIcon from '@mui/icons-material/Compress'; 
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'; 

// 3. Огонь
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'; 
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; 
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'; 
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'; 
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'; 

// 4. Ясность
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'; 
import VerifiedIcon from '@mui/icons-material/Verified'; 
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; 
import WbTwilightIcon from '@mui/icons-material/WbTwilight'; 
import WeekendIcon from '@mui/icons-material/Weekend'; 

// 5. Полет
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'; 
import LightbulbIcon from '@mui/icons-material/Lightbulb'; 
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import SearchIcon from '@mui/icons-material/Search'; 
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 

export type MoodGroup = {
  id: string;
  label: string;
  color: string;
  gradient: string;
  icon: React.ComponentType<SvgIconProps>;
  description: string;
};

export type MoodOption = {
  id: string;
  groupId: string;
  label: string;      
  fullLabel: string;  
  icon: React.ComponentType<SvgIconProps>;
};

// === 1. ГРУППЫ (Главные плитки) ===
export const MOOD_GROUPS: MoodGroup[] = [
  { 
    id: 'heaviness', 
    label: 'Тяжесть', 
    color: '#546E7A', 
    gradient: 'from-slate-700 to-slate-900',
    icon: CloudIcon,
    description: 'Грусть, усталость, пустота'
  },
  { 
    id: 'storm',     
    label: 'Шторм',   
    color: '#29B6F6', 
    gradient: 'from-sky-500 to-blue-700',
    icon: TsunamiIcon,
    description: 'Тревога, страх, паника'
  },
  { 
    id: 'fire',      
    label: 'Огонь',   
    color: '#FF7043', 
    gradient: 'from-orange-500 to-red-700',
    icon: WhatshotIcon,
    description: 'Злость, раздражение, обида'
  },
  { 
    id: 'clarity',   
    label: 'Ясность', 
    color: '#26A69A', 
    gradient: 'from-teal-400 to-teal-700',
    icon: SpaIcon,
    description: 'Спокойствие, уверенность'
  },
  { 
    id: 'flight',    
    label: 'Полет',   
    color: '#FFCA28', 
    gradient: 'from-amber-300 to-yellow-600',
    icon: HistoryEduIcon,
    description: 'Радость, вдохновение'
  },
];

// === 2. СПИСОК ЭМОЦИЙ (Детальный экран) ===
export const MOODS: MoodOption[] = [
  // --- HEAVINESS ---
  { id: 'sadness', groupId: 'heaviness', label: 'Грусть', fullLabel: 'Хочется плакать', icon: WaterDropIcon },
  { id: 'fatigue', groupId: 'heaviness', label: 'Усталость', fullLabel: 'Нет сил', icon: BatteryAlertIcon },
  { id: 'emptiness', groupId: 'heaviness', label: 'Пустота', fullLabel: 'Ничего не чувствую', icon: CropFreeIcon },
  { id: 'loneliness', groupId: 'heaviness', label: 'Одиночество', fullLabel: 'Меня никто не понимает', icon: PersonOffIcon },
  { id: 'powerless', groupId: 'heaviness', label: 'Бессилие', fullLabel: 'Не могу повлиять', icon: BlockIcon },

  // --- STORM ---
  { id: 'anxiety', groupId: 'storm', label: 'Тревога', fullLabel: 'Фоновое беспокойство', icon: WavesIcon },
  { id: 'fear', groupId: 'storm', label: 'Страх', fullLabel: 'Боюсь чего-то конкретного', icon: VisibilityOffIcon },
  { id: 'panic', groupId: 'storm', label: 'Паника', fullLabel: 'Теряю контроль', icon: CycloneIcon },
  { id: 'stress', groupId: 'storm', label: 'Стресс', fullLabel: 'Давление обстоятельств', icon: CompressIcon },
  { id: 'confusion', groupId: 'storm', label: 'Растерянность', fullLabel: 'Не знаю, куда идти', icon: QuestionMarkIcon },

  // --- FIRE ---
  { id: 'anger', groupId: 'fire', label: 'Злость', fullLabel: 'Хочется разрушать', icon: ThunderstormIcon },
  { id: 'irritation', groupId: 'fire', label: 'Раздражение', fullLabel: 'Все бесит', icon: ErrorOutlineIcon },
  { id: 'resentment', groupId: 'fire', label: 'Обида', fullLabel: 'Чувство несправедливости', icon: SentimentDissatisfiedIcon },
  { id: 'jealousy', groupId: 'fire', label: 'Ревность', fullLabel: 'Сравнение себя с другими', icon: CompareArrowsIcon },
  { id: 'passion', groupId: 'fire', label: 'Страсть', fullLabel: 'Горение идеей', icon: LocalFireDepartmentIcon },

  // --- CLARITY ---
  { id: 'calm', groupId: 'clarity', label: 'Спокойствие', fullLabel: 'Внутренняя тишина', icon: SelfImprovementIcon },
  { id: 'confidence', groupId: 'clarity', label: 'Уверенность', fullLabel: 'Твердая почва', icon: VerifiedIcon },
  { id: 'gratitude', groupId: 'clarity', label: 'Благодарность', fullLabel: 'Теплое чувство', icon: VolunteerActivismIcon },
  { id: 'hope', groupId: 'clarity', label: 'Надежда', fullLabel: 'Свет в конце туннеля', icon: WbTwilightIcon },
  { id: 'relax', groupId: 'clarity', label: 'Расслабленность', fullLabel: 'Тело отдыхает', icon: WeekendIcon },

  // --- FLIGHT ---
  { id: 'joy', groupId: 'flight', label: 'Радость', fullLabel: 'Легкость и улыбка', icon: SentimentVerySatisfiedIcon },
  { id: 'inspiration', groupId: 'flight', label: 'Вдохновение', fullLabel: 'Поток идей', icon: LightbulbIcon },
  { id: 'love', groupId: 'flight', label: 'Любовь', fullLabel: 'Сердце открыто', icon: FavoriteIcon },
  { id: 'curiosity', groupId: 'flight', label: 'Любопытство', fullLabel: 'Интерес к новому', icon: SearchIcon },
  { id: 'pride', groupId: 'flight', label: 'Гордость', fullLabel: 'Довольство собой', icon: EmojiEventsIcon },
];