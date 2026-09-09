// Default course selection per course-landing page. The lead + fee forms default
// their course dropdown to the page's own course so visitors don't accidentally
// submit a different one (e.g. someone on /mba leaving it on BCA). Values MUST
// match copy.apply.courses. B.Tech defaults to its first branch (CSE); the user
// can still pick another branch. Home / Meta / unmapped paths use the fallback.
const COURSE_BY_PATH: Record<string, string> = {
  "/btech": "B.Tech-CSE",
  "/bca": "BCA",
  "/bba": "BBA",
  "/bsc-it": "B.Sc-IT",
  "/bcom": "B.Com.(P)",
  "/mca": "MCA",
  "/mba": "MBA",
};

export function defaultCourseForPath(pathname: string | null | undefined, fallback = "BCA"): string {
  return COURSE_BY_PATH[(pathname ?? "").replace(/\/+$/, "") || "/"] ?? fallback;
}
