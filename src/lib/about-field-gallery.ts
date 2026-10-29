export type AboutFieldPhoto = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
};

const defaultPhotos: AboutFieldPhoto[] = [
  {
    id: "commissioning",
    title: "Commissioning together",
    description: "Hands-on support from installation to production readiness.",
    image_url: "/gallery/customer-visits/international-machine-commissioning.webp",
    alt_text: "Modtech engineers and customers beside a commissioned machine",
  },
  {
    id: "collaboration",
    title: "Technical collaboration",
    description: "Working alongside customers on practical factory solutions.",
    image_url: "/gallery/customer-visits/international-technical-collaboration.webp",
    alt_text: "Modtech team and international partners on a factory floor",
  },
  {
    id: "machine-visit",
    title: "Customer machine visits",
    description: "Real equipment and conversations where the systems are used.",
    image_url: "/gallery/customer-visits/uk-customer-machine-visit.webp",
    alt_text: "Modtech representatives with customers in front of a casting machine",
  },
  {
    id: "site-installation",
    title: "On-site installation",
    description: "Engineering teams bringing a new machine into service.",
    image_url: "/gallery/customer-visits/customer-site-installation.webp",
    alt_text: "Modtech and customer teams beside installed machinery",
  },
  {
    id: "global-partnerships",
    title: "Global partnerships",
    description: "Building long-term relationships through direct collaboration.",
    image_url: "/gallery/customer-visits/thailand-customer-visit.webp",
    alt_text: "Modtech representatives with a customer team in Thailand",
  },
];

export function isAboutPhotoUrl(value: string) {
  return /^(\/[^/]|https:\/\/[^/]+)/i.test(value.trim());
}

export function parseAboutFieldGallery(content: Record<string, string>): AboutFieldPhoto[] {
  const raw = content.field_gallery;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object",
          )
          .map((item, index) => ({
            id: String(item.id || `field-photo-${index}`),
            title: String(item.title || ""),
            description: String(item.description || ""),
            image_url: String(item.image_url || ""),
            alt_text: String(item.alt_text || ""),
          }));
      }
    } catch {
      // Older content may not have a structured gallery yet.
    }
  }

  return defaultPhotos.map((photo, index) => ({
    ...photo,
    image_url: content[`about_photo_${index + 1}`] || photo.image_url,
  }));
}

export function validateAboutFieldGallery(photos: AboutFieldPhoto[]): string | null {
  if (photos.length > 12) return "Keep the field gallery to 12 images or fewer.";
  if (new Set(photos.map((photo) => photo.id)).size !== photos.length)
    return "Each field gallery image needs a unique ID.";
  for (const [index, photo] of photos.entries()) {
    if (!photo.title.trim()) return `Image ${index + 1} needs a title.`;
    if (!isAboutPhotoUrl(photo.image_url))
      return `Image ${index + 1} needs a site path or an https URL.`;
    if (!photo.alt_text.trim()) return `Image ${index + 1} needs descriptive alt text.`;
    if (photo.title.length > 100 || photo.alt_text.length > 180 || photo.description.length > 240)
      return `Image ${index + 1} has text that is too long.`;
  }
  return null;
}

export function serializeAboutFieldGallery(photos: AboutFieldPhoto[]) {
  return JSON.stringify(
    photos.map((photo) => ({
      ...photo,
      title: photo.title.trim(),
      description: photo.description.trim(),
      image_url: photo.image_url.trim(),
      alt_text: photo.alt_text.trim(),
    })),
  );
}
