import mongoose from 'mongoose';
import { connectDB } from '../server/config/db.js';
import { User } from '../server/models/User.js';
import { Company } from '../server/models/Company.js';
import { Job } from '../server/models/Job.js';
import { StudentProfile } from '../server/models/StudentProfile.js';

export default async function handler(req, res) {
  const { secret } = req.query;
  if (secret !== 'casetu_seed_2026') {
    return res.status(403).json({ success: false, message: 'Invalid or missing seed key' });
  }

  try {
    await connectDB();

    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      return res.status(200).json({
        success: true,
        message: 'Database already has job listings. No re-seeding needed.',
        jobsCount: existingJobs,
      });
    }

    // 1. Create Employer & Admin users
    const employerUser = await User.create({
      name: 'Vikram Sengupta (Partner, HR)',
      email: 'hiring@motilaloswal.com',
      password: 'password123',
      role: 'employer',
      phone: '+91 98110 56789',
    });

    const adminUser = await User.create({
      name: 'CA Dwar Admin',
      email: 'admin@casetu.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+91 99999 00000',
    });

    // 2. Create Companies
    const companies = await Company.create([
      {
        userId: employerUser._id,
        name: 'Motilal Oswal Alternates',
        firmType: 'Corporate / MNC',
        registrationNumber: 'U67190MH2006PTC160583',
        city: 'Mumbai',
        address: 'Motilal Oswal Tower, Gokhale Road, Prabhadevi, Mumbai 400025',
        website: 'https://www.motilaloswalalternates.com',
        initials: 'MO',
        isVerified: true,
        description: 'Alternative asset management arm of Motilal Oswal Financial Services, managing over $2 Billion across Private Equity and Real Estate funds.',
      },
      {
        name: 'BDO India LLP',
        firmType: 'Top 20 National Firm',
        registrationNumber: '112000W/W-100042',
        city: 'Mumbai',
        address: 'The Ruby, Senapati Bapat Marg, Dadar West, Mumbai 400028',
        website: 'https://www.bdo.in',
        initials: 'BDO',
        isVerified: true,
        description: 'Member firm of BDO International, fifth largest accountancy network worldwide.',
      },
      {
        name: 'Grant Thornton Bharat',
        firmType: 'Top 20 National Firm',
        registrationNumber: '107452W',
        city: 'Gurugram',
        address: 'DLF Cyber City, Tower C, DLF Phase 2, Gurugram 122002',
        website: 'https://www.grantthornton.in',
        initials: 'GT',
        isVerified: true,
        description: 'One of India’s leading assurance, tax and advisory firms helping dynamic businesses grow.',
      },
      {
        name: 'Avendus Capital',
        firmType: 'Corporate / MNC',
        registrationNumber: 'U99999MH1999PTC123382',
        city: 'Mumbai',
        address: 'IL&FS Financial Centre, BKC, Bandra East, Mumbai 400051',
        website: 'https://www.avendus.com',
        initials: 'AC',
        isVerified: true,
        description: 'Leading institutional investment bank with deep focus on M&A advisory and private equity.',
      },
      {
        name: 'Tata Capital Financial Services',
        firmType: 'Corporate / MNC',
        registrationNumber: 'U65990MH1991PLC060670',
        city: 'Mumbai',
        address: 'One Forbes, Dr. V.B. Gandhi Marg, Fort, Mumbai 400001',
        website: 'https://www.tatacapital.com',
        initials: 'TC',
        isVerified: true,
        description: 'Flagship financial services company of the Tata Group.',
      },
    ]);

    // 3. Create Sample Job Vacancies
    const jobs = await Job.create([
      {
        companyId: companies[0]._id,
        title: 'CA Industrial Trainee – Private Equity',
        category: 'industrial-training',
        categoryName: 'Industrial Training',
        domain: 'Private Equity',
        city: 'Mumbai',
        workMode: 'Hybrid',
        stipendMin: 25000,
        stipendMax: 40000,
        stipendPeriod: 'Monthly',
        eligibility: 'CA Final student eligible for 9-12 months of Industrial Training',
        requiredGroups: 'Both Groups',
        attempts: 'First Attempt Preferred',
        openVacancies: 2,
        isFeatured: true,
        status: 'Published',
        description: 'Assist investment directors on deal evaluation, commercial due diligence, and financial modeling.',
        responsibilities: ['Build dynamic 3-statement LBO and DCF models', 'Conduct sector benchmarking', 'Prepare IC memos'],
        requiredSkills: ['Financial Modeling', 'Ind AS', 'Advanced Excel'],
      },
      {
        companyId: companies[3]._id,
        title: 'CA Industrial Trainee – Investment Banking (M&A)',
        category: 'industrial-training',
        categoryName: 'Industrial Training',
        domain: 'Investment Banking',
        city: 'Mumbai',
        workMode: 'On-site',
        stipendMin: 35000,
        stipendMax: 50000,
        stipendPeriod: 'Monthly',
        eligibility: 'CA Finalist with min 18 months of completed articleship',
        requiredGroups: 'Both Groups',
        attempts: 'Max 2 Attempts',
        openVacancies: 1,
        isFeatured: true,
        status: 'Published',
        description: 'Work on live sell-side mandates, valuation decks, and transaction structuring in tech and consumer sectors.',
        responsibilities: ['Draft CIMs and pitch books', 'Valuation modeling', 'Coordinate data rooms'],
        requiredSkills: ['Financial Modeling', 'Valuation', 'Corporate Finance'],
      },
      {
        companyId: companies[1]._id,
        title: 'CA Article Trainee – Statutory Audit & Assurance',
        category: 'articleship',
        categoryName: 'Articleship',
        domain: 'Statutory Audit & Assurance',
        city: 'Mumbai',
        workMode: 'On-site',
        stipendMin: 15000,
        stipendMax: 22000,
        stipendPeriod: 'Monthly',
        eligibility: 'CA Intermediate cleared (Both Groups preferred)',
        requiredGroups: 'Both Groups',
        attempts: 'Any',
        openVacancies: 6,
        isFeatured: true,
        status: 'Published',
        description: 'Execute substantive audit procedures on listed entities, FMCG conglomerates, and financial institutions.',
        responsibilities: ['Substantive audit testing', 'ICFR testing', 'CARO 2020 verification'],
        requiredSkills: ['Accounting Principles', 'MS Excel', 'CARO 2020'],
      },
      {
        companyId: companies[2]._id,
        title: 'CA Article Trainee – Direct Tax & International Tax',
        category: 'articleship',
        categoryName: 'Articleship',
        domain: 'Direct Tax & International Tax',
        city: 'Gurugram',
        workMode: 'Hybrid',
        stipendMin: 14000,
        stipendMax: 20000,
        stipendPeriod: 'Monthly',
        eligibility: 'CA Inter Both Groups Cleared',
        requiredGroups: 'Both Groups',
        attempts: 'First Attempt Preferred',
        openVacancies: 4,
        isFeatured: true,
        status: 'Published',
        description: 'Exposure spans corporate tax returns, Form 3CD tax audit reports, and CIT(A) appellate defense.',
        responsibilities: ['Tax computations', 'Tax audit checklists', 'Case law research'],
        requiredSkills: ['Income Tax Act', 'MS Excel', 'Legal Research'],
      },
      {
        companyId: companies[4]._id,
        title: 'CA Industrial Trainee – FP&A & Corporate Finance',
        category: 'industrial-training',
        categoryName: 'Industrial Training',
        domain: 'FP&A',
        city: 'Mumbai',
        workMode: 'On-site',
        stipendMin: 30000,
        stipendMax: 42000,
        stipendPeriod: 'Monthly',
        eligibility: 'CA Final student with 12 months minimum training completed',
        requiredGroups: 'Both Groups',
        attempts: 'Max 2 Attempts',
        openVacancies: 3,
        isFeatured: false,
        status: 'Published',
        description: 'Work directly with the Head of FP&A on annual operating plans, budget variance, and profitability.',
        responsibilities: ['MIS consolidation', 'Variance analysis', 'ALM modeling'],
        requiredSkills: ['Financial Planning', 'Excel', 'Ind AS 109'],
      },
      {
        companyId: companies[4]._id,
        title: 'Finance Analyst – CA Fresher (Corporate Treasury)',
        category: 'ca-jobs',
        categoryName: 'CA Jobs',
        domain: 'Corporate Finance',
        city: 'Mumbai',
        workMode: 'Hybrid',
        stipendMin: 950000,
        stipendMax: 1250000,
        stipendPeriod: 'Per Annum',
        eligibility: 'Qualified Chartered Accountant',
        requiredGroups: 'Both Groups',
        attempts: 'Max 2 Attempts',
        openVacancies: 2,
        isFeatured: true,
        status: 'Published',
        description: 'Manage commercial paper issuances, NCD bond programs, and corporate liquidity allocations.',
        responsibilities: ['Cash flow forecasting', 'Rating agency decks', 'RBI compliance returns'],
        requiredSkills: ['Treasury Management', 'Ind AS 109', 'Corporate Finance'],
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'MongoDB Atlas successfully seeded with verified companies and jobs!',
      companiesSeeded: companies.length,
      jobsSeeded: jobs.length,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
