import futureSelfIcon from "../images/future-self.svg";
import overcomingBarriersIcon from "../images/overcoming-barriers.svg";
import specialSituationsIcon from "../images/special-situations.svg";
import mindsetInspirationIcon from "../images/mindset-inspiration.svg";

// Labels for affirmations categories
export const AFFIRMATION_LABELS = {
  // motivation_and_inspiration: "Motivation",
  // self_confidence: "Self-Confidence",
  // career_growth: "Career Growth",
  // resilience: "Resilience",
  // skill_recognition: "Skill Recognition",
  // networking: "Networking",
  // goal_setting: "Goal Setting",
  // interview_preparation: "Interview Preparation",
  // stress_relief: "Stress Relief",
  // financial_abundance: "Financials",
  // work_life_balance: "Work-Life Balance",
  // gratitude_positivity: "Gratitude",
  // purpose_fulfillment: "Purpose",
  // face_rejection: "Face Rejection",
  overcome_imposter_syndrome: "Imposter Syndrome",
  develop_self_confidence: "Self-Confidence",
  embrace_growth_mindset: "Growth Mindset",
  let_go_of_perfectionism: "Perfectionism",
  own_your_achievements: "Achievements",
  control_stress_anxiety: "Stress & Anxiety",
  prevent_burnout: "Burnout",
  find_work_life_balance: "Work-Life Balance",
  declutter_the_mind: "Peaceful Mind",
  enjoy_your_work: "Fulfilling Work",
  attract_job_opportunities: "New Opportunities",
  develop_wealth_mindset: "Wealth Mindset",
  succeed_in_negotiations: "Negotiations",
  overcome_fear_of_charging_more: "Charging More",
  trust_financial_stability: "Financial Stability",
  achieve_career_goals: "Career Goals",
  increase_determination: "Persistence",
  enhance_focus_productivity: "Focus",
  push_through_failure: "Failure",
  develop_leadership: "Leadership",
};

// Grouped categories for UI
export const AFFIRMATION_CATEGORIES = {
  "Confidence & Self-Belief": {
    keys: [
      "overcome_imposter_syndrome",
      "develop_self_confidence",
      "embrace_growth_mindset",
      "let_go_of_perfectionism",
      "own_your_achievements",
    ],
    icon: futureSelfIcon,
  },
  "Stress & Work-Life Balance": {
    keys: [
      "control_stress_anxiety",
      "prevent_burnout",
      "find_work_life_balance",
      "declutter_the_mind",
      "enjoy_your_work",
    ],
    icon: overcomingBarriersIcon,
  },
  "Money & Abundance": {
    keys: [
      "attract_job_opportunities",
      "develop_wealth_mindset",
      "succeed_in_negotiations",
      "overcome_fear_of_charging_more",
      "trust_financial_stability",
    ],
    icon: specialSituationsIcon,
  },
  "Success & Career Growth": {
    keys: [
      "achieve_career_goals",
      "increase_determination",
      "enhance_focus_productivity",
      "push_through_failure",
      "develop_leadership",
    ],
    icon: mindsetInspirationIcon,
  },
};

// Labels for job status categories
export const JOBSTATUS_LABELS = {
  unemployed: "Unemployed",
  career_changer: "Career Changer",
  employed: "Employed",
  entrepreneur: "Entrepreneur",
  graduate: "Recently Graduated",
  student: "Student",
};

// Labels for appearance categories
export const APPEARANCE_LABELS = {
  light: "Light",
  dark: "Dark",
};

// Default data
export const DEFAULT_USER_DATA = {
  dailyGoal: 20,
  dailyProgress: {},
  createdAt: new Date().toISOString(),
  appearance: "light",
};

export const DEFAULT_USER_SETTINGS = {
  selectedCategories: ["overcome_imposter_syndrome"],
  jobStatus: "career_changer",
};
