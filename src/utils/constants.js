// Labels for affirmations categories
export const AFFIRMATION_LABELS = {
    motivation_and_inspiration: "Motivation",
    self_confidence: "Self-Confidence",
    career_growth: "Career Growth",
    resilience: "Resilience",
    skill_recognition: "Skill Recognition",
    networking: "Networking",
    goal_setting: "Goal Setting",
    interview_preparation: "Interview Preparation",
    stress_relief: "Stress Relief",
    financial_abundance: "Financials",
    work_life_balance: "Work-Life Balance",
    gratitude_positivity: "Gratitude",
    purpose_fulfillment:"Purpose",
    face_rejection: "Face Rejection",
  };

  // Labels for job status categories
export const JOBSTATUS_LABELS = {
    unemployed: "Unemployed",
    career_changer: "Career Changer",
    employed: "Employed",
    entrepreneur: "Entrepreneur",
    // graduate: "Recently Graduated",
    // returning_to_workforce: "Returning to Workforce",
    // student: "Student",
};

  // Labels for appearance categories
export const APPEARANCE_LABELS = {
  light: "Light",
  dark: "Dark",
}


// Default data
export const DEFAULT_USER_DATA = {
  dailyGoal: 20,
  dailyProgress: {},
  createdAt: new Date().toISOString(),
  appearance: "light",
};

export const DEFAULT_USER_SETTINGS = {
  selectedCategories: ["motivation_and_inspiration"],
  jobStatus: "unemployed",
};
