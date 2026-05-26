const COUNTRY_ALIASES: Record<string, string> = {
  USA: 'US',
  'U.S.': 'US',
  'U.S.A': 'US',
  'UNITED STATES OF AMERICA': 'US',

  UK: 'GB',
  GBR: 'GB',

  CAN: 'CA',
  IND: 'IN',
  AUS: 'AU',
  NZL: 'NZ',
  UAE: 'AE',
};

export const getFullCountryName = (country?: string | null): string => {
  if (!country?.trim()) return '—';

  const rawCountry = country.trim();
  const upperCountry = rawCountry.toUpperCase();

  const countryCode = COUNTRY_ALIASES[upperCountry] ?? upperCountry;

  // Intl.DisplayNames works best with 2-letter ISO country codes
  if (/^[A-Z]{2}$/.test(countryCode)) {
    try {
      const regionNames = new Intl.DisplayNames(['en'], {
        type: 'region',
      });

      return regionNames.of(countryCode) ?? rawCountry;
    } catch {
      return rawCountry;
    }
  }

  // If backend already sends full country name, keep it as-is
  return rawCountry;
};
