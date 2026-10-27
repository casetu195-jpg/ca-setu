import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide company/firm name'],
      trim: true,
    },
    firmType: {
      type: String,
      enum: [
        'Top 20 National Firm',
        'Big 4 / Big 6',
        'Partnership / LLP',
        'Sole Proprietorship',
        'Corporate / MNC',
        'Boutique Advisory',
        'CA Firm / Corporate',
      ],
      default: 'Partnership / LLP',
      required: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide ICAI FRN or Corporate CIN'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: String,
    logo: String,
    initials: String,
    description: String,
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationDocumentUrl: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model('Company', companySchema);
