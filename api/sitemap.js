import mongoose from 'mongoose';
import { connectDB } from '../server/config/db.js';
import { Job } from '../server/models/Job.js';

export default async function handler(req, res) {
  const BASE_URL = 'https://cadwar.in';

  // Core public static pages
  const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/articleship`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/industrial-training`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/ca-jobs`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/companies`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.7', changefreq: 'monthly' },
  ];

  let jobUrls = [];

  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    if (mongoose.connection.readyState === 1) {
      const activeJobs = await Job.find({ status: 'Published' })
        .select('_id updatedAt createdAt')
        .sort({ updatedAt: -1 })
        .lean();

      jobUrls = activeJobs.map((job) => {
        const lastModDate = job.updatedAt || job.createdAt || new Date();
        const lastMod = new Date(lastModDate).toISOString().split('T')[0];
        return {
          loc: `${BASE_URL}/jobs/${job._id}`,
          lastmod: lastMod,
          priority: '0.8',
          changefreq: 'daily',
        };
      });
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap from MongoDB Atlas:', error.message);
  }

  const today = new Date().toISOString().split('T')[0];

  const urlsXml = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...jobUrls.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
  ].join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
  );
  return res.status(200).send(sitemapXml);
}
