import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['articleship', 'industrial-training', 'ca-jobs'],
      required: true,
      index: true,
    },
    categoryName: String,
    domain: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'On-site',
      required: true,
    },
    stipendMin: {
      type: Number,
      required: true,
    },
    stipendMax: {
      type: Number,
      required: true,
    },
    stipendPeriod: {
      type: String,
      enum: ['Monthly', 'Per Annum'],
      default: 'Monthly',
    },
    openVacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    requiredGroups: {
      type: String,
      enum: ['Both Groups', 'Group 1', 'Group 2', 'Either Group'],
      default: 'Both Groups',
      required: true,
    },
    attempts: {
      type: String,
      default: 'Any',
    },
    eligibility: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      default: '15 days left',
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String],
    whatYouWillLearn: [String],
    requiredSkills: [String],
    preferredSkills: [String],
    status: {
      type: String,
      enum: ['Draft', 'Pending Review', 'Published', 'Paused', 'Closed', 'Rejected'],
      default: 'Draft',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    postedTime: {
      type: String,
      default: 'Recently',
    },
    applicationLink: {
      type: String,
      trim: true,
    },
    recruiterEmail: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    publishedAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model('Job', jobSchema);
