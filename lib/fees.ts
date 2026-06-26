/**
 * CIMAGE fee structure (2026–2029 session), sourced from
 * https://cimage.in/fee-structure-2/ . Amounts are pre-formatted strings.
 *
 * `FEE_PLANS` is keyed by a fee-plan id; `COURSE_FEE_KEY` maps each course
 * `value` from copy.apply.courses to its plan. The same plan can back several
 * course options (e.g. EE/CE/ECE share one B.Tech plan; BCA and B.Sc-IT share
 * one plan; MBA and MCA share one).
 */

export type FeePlan = {
  /** Display name used in the generated PDF. */
  course: string;
  duration: string;
  /** Three headline payment modes. */
  totals: { complete: string; down: string; regular: string };
  /** Clear, reliable payment highlights. */
  atAdmission: string;
  annual: string; // per year, Year 2 onwards
};

export const ONE_TIME_CHARGES: { label: string; amount: string }[] = [
  { label: "Admission Fee", amount: "₹10,000" },
  { label: "Internal Exam Fee", amount: "₹1,000 / semester" },
  { label: "Library Deposit (refundable)", amount: "₹1,000" },
  { label: "University Registration & Exam Fee", amount: "As per University" },
];

// Figures below are the REGULAR fee plan: `atAdmission` = first installment,
// `annual` = per-year fee (Year 2 onwards), `totals.regular` = total payable.
export const FEE_PLANS: Record<string, FeePlan> = {
  btech_aiml: {
    course: "B.Tech – Artificial Intelligence & Machine Learning (AI-ML)",
    duration: "4 Years",
    totals: { complete: "₹3,25,000", down: "₹4,32,000", regular: "₹4,72,000" },
    atAdmission: "₹29,500",
    annual: "₹1,18,000",
  },
  btech_cse: {
    course: "B.Tech – Computer Science & Engineering (CSE)",
    duration: "4 Years",
    totals: { complete: "₹2,99,000", down: "₹3,84,000", regular: "₹4,24,000" },
    atAdmission: "₹26,500",
    annual: "₹1,06,000",
  },
  btech_other: {
    course: "B.Tech – Electrical / Civil / Electronics & Comm. (EE · CE · ECE)",
    duration: "4 Years",
    totals: { complete: "₹2,49,000", down: "₹3,20,000", regular: "₹3,60,000" },
    atAdmission: "₹22,500",
    annual: "₹90,000",
  },
  bca_bscit: {
    course: "BCA / B.Sc-IT",
    duration: "3 Years",
    totals: { complete: "₹2,15,000", down: "₹2,70,000", regular: "₹2,88,000" },
    atAdmission: "₹24,000",
    annual: "₹96,000",
  },
  bba: {
    course: "BBA",
    duration: "3 Years",
    totals: { complete: "₹1,80,000", down: "₹2,25,000", regular: "₹2,34,000" },
    atAdmission: "₹19,500",
    annual: "₹78,000",
  },
  bcom: {
    course: "B.Com (Professional)",
    duration: "3 Years",
    totals: { complete: "₹1,54,000", down: "₹1,89,000", regular: "₹1,98,000" },
    atAdmission: "₹16,500",
    annual: "₹66,000",
  },
  pg: {
    course: "MBA / MCA",
    duration: "2 Years",
    totals: { complete: "₹2,21,000", down: "₹2,88,000", regular: "₹3,00,000" },
    atAdmission: "₹37,500",
    annual: "₹1,50,000",
  },
};

/** Course `value` (from copy.apply.courses) → fee-plan key. */
export const COURSE_FEE_KEY: Record<string, string> = {
  BCA: "bca_bscit",
  "B.Sc-IT": "bca_bscit",
  "B.Tech-CSE": "btech_cse",
  "B.Tech-AIML": "btech_aiml",
  "B.Tech-ECE": "btech_other",
  "B.Tech-EE": "btech_other",
  "B.Tech-CE": "btech_other",
  MCA: "pg",
  MBA: "pg",
  BBA: "bba",
  "B.Com.(P)": "bcom",
};

export function feePlanForCourse(courseValue: string): FeePlan | null {
  const key = COURSE_FEE_KEY[courseValue];
  return key ? FEE_PLANS[key] ?? null : null;
}
