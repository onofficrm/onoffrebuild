export function recommendFeatureKeys(siteType: string, industry: string, purposes: string[] = []): string[] {
  const site = (siteType || '').toLowerCase();
  const ind = industry || '';
  const purpose = purposes.map((p) => p.toLowerCase());
  const keys: string[] = ['inquiry_form'];

  if (purpose.includes('seo') || site === 'info_blog' || site === 'seo_affiliate') {
    keys.push('blog');
  }
  if (site === 'local_service' || ind.includes('지역')) {
    keys.push('map', 'phone_call', 'kakaotalk');
  }
  if (site === 'travel' || site === 'professional' || ind.includes('예약')) {
    keys.push('reservation');
  }
  if (site === 'shopping') {
    keys.push('payment', 'gallery');
  }

  return [...new Set(keys)];
}
