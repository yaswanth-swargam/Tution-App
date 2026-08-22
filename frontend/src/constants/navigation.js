import {
  Home,
  BookOpen,
  Bot,
  User,
  Settings,
} from "lucide-react";

import { ROUTES } from "./routes";

export const navigation = [
  {
    id: 1,
    label: "Community",
    path: ROUTES.COMMUNITY,
    icon: Home,
  },
  {
    id: 2,
    label: "Study Materials",
    path: ROUTES.MATERIALS,
    icon: BookOpen,
  },
  {
    id: 3,
    label: "AI Assistant",
    path: ROUTES.AI,
    icon: Bot,
  },
  {
    id: 4,
    label: "Profile",
    path: ROUTES.PROFILE,
    icon: User,
  },
  {
    id: 5,
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];