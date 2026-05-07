export const ogImageUrl = (params: { title: string; subtitle?: string }) => {
  const sp = new URLSearchParams();
  sp.set("title", params.title);
  if (params.subtitle) sp.set("subtitle", params.subtitle);
  return `/api/og?${sp.toString()}`;
};

export const SITE_URL = "https://black-q.com";
export const SITE_NAME = "BlackQ";
export const SITE_TAGLINE = "Bring AI to everyone.";
export const SITE_TAGLINE_CN = "让 AI 走进每个人的生活";
