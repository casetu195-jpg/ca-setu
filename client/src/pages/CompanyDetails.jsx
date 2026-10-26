import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import JobCard from '../components/common/JobCard';
import SEO from '../components/common/SEO';
import { Building2, MapPin, Globe, ShieldCheck, ChevronRight, Briefcase } from 'lucide-react';

export default function CompanyDetails() {
  const { id } = useParams();
  const { getCompanyById, jobs } = useJobs();

  const company = getCompanyById(id);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <SEO
          title="Firm Profile Not Found | CA Dwar"
          description="The requested CA firm profile is not available on CA Dwar."
          canonicalPath={`/companies/${id}`}
          noindex={true}
        />
        <h2 className="text-2xl font-bold text-[#173B63]">Company Not Found</h2>
        <Link to="/companies" className="text-[#176FA8] underline">
          Browse all verified companies
        </Link>
      </div>
    );
  }

  const companyJobs = jobs.filter((j) => j.companyId === company.id && j.status === 'Published');

  const seoTitle = `${company.name} — CA Vacancies & Firm Profile | CA Dwar`;
  const seoDescription = company.description
    ? `${company.name} - ${company.description.substring(0, 140)}...`
    : `Explore verified CA Articleship, Industrial Training, and finance openings at ${company.name} on CA Dwar.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/companies/${company.id || id}`}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#176FA8]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/companies" className="hover:text-[#176FA8]">Companies</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#152B45] font-semibold">{company.name}</span>
      </nav>

      {/* Hero Profile Card */}
      <div className="bg-white border border-[#DCE5ED] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-2xl text-[#173B63] overflow-hidden shadow-2xs">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={company.logo ? 'hidden' : 'block'}>
                {company.initials || company.name.slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-extrabold text-[#152B45]">
                  {company.name}
                </h1>
                {company.isVerified && <VerifiedBadge size="md" />}
              </div>

              <div className="flex items-center flex-wrap gap-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{company.firmType}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.city}
                </span>
                <span>·</span>
                <span className="font-mono text-[#173B63]">FRN: {company.registrationNumber}</span>
              </div>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-[#DCE5ED] hover:bg-slate-50 text-[#176FA8] font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Official Website</span>
            </a>
          )}
        </div>

        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            About the Organization
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {company.description}
          </p>
          <p className="text-xs text-slate-500">
            <strong>Registered Office Address:</strong> {company.address}
          </p>
        </div>
      </div>

      {/* Active Vacancies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#173B63] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#176FA8]" />
            Active Opportunities at {company.name} ({companyJobs.length})
          </h2>
        </div>

        {companyJobs.length === 0 ? (
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-10 text-center text-xs text-slate-500">
            No active vacancies currently open at this firm. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
