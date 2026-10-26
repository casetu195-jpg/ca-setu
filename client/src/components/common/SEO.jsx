import { useEffect } from 'react';

const DEFAULT_TITLE = 'CA Dwar | CA Articleship, Industrial Training & Jobs';
const DEFAULT_DESCRIPTION =
  'Explore CA Articleship, Industrial Training and CA job opportunities across India on CA Dwar. Discover openings and connect with recruiters.';
const BASE_CANONICAL = 'https://cadwar.in';

export default function SEO({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  ogImage = 'https://cadwar.in/favicon.svg',
  jsonLd = null,
  noindex = false,
}) {
  useEffect(() => {
    // 1. Page Title
    const finalTitle = title || DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description
    const finalDesc = description || DEFAULT_DESCRIPTION;
    setMetaTag('name', 'description', finalDesc);

    // 3. Robots
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical URL
    const cleanPath = canonicalPath === '/' ? '' : canonicalPath;
    const finalCanonical = `${BASE_CANONICAL}${cleanPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', 'CA Dwar');
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:image', ogImage);

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Structured Data (JSON-LD)
    const scriptId = 'dynamic-page-jsonld';
    let scriptTag = document.getElementById(scriptId);

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup dynamic JSON-LD on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, jsonLd, noindex]);

  return null;
}
