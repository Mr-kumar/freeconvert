export function normalizeAdSenseClientId(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^ca-pub-\d{16}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^pub-\d{16}$/.test(trimmed)) {
    return `ca-${trimmed}`;
  }

  return trimmed;
}

export function normalizeAdSensePublisherId(value: string | undefined) {
  const trimmed = value?.trim().replace(/^ca-/, "");

  if (trimmed && /^pub-\d{16}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function normalizeAdSenseSlotId(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || /^0+$/.test(trimmed)) {
    return undefined;
  }

  if (/^\d{10,}$/.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}
