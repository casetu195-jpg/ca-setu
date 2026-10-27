import React from 'react';
import { initialCities, initialDomains } from '../../services/mockData';
import { X, Filter, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  category = 'articleship',
  selectedFilters,
  onFilterChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
  customDomains = [],
}) {
  const baseDomains =
    category === 'articleship'
      ? initialDomains.articleship
      : category === 'industrial-training'
      ? initialDomains.industrial
      : initialDomains.jobs;

  const domainsList = Array.from(
    new Set([...baseDomains, ...customDomains.filter(Boolean)])
  );

  const workModes = ['On-site', 'Hybrid', 'Remote'];
  const groupsList = ['Both Groups', 'Group 1', 'Group 2', 'Either Group'];
  const firmTypes = [
    'Top 20 National Firm',
    'Big 4 / Big 6',
    'Partnership / LLP',
    'Corporate / MNC',
    'Boutique Advisory',
  ];

  const handleCheckbox = (group, value) => {
    const current = selectedFilters[group] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(group, updated);
  };

  const content = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#176FA8]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#173B63]">
            Filters
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#176FA8] hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Filter 1: City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          City / Location
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {initialCities.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#152B45] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(selectedFilters.cities || []).includes(c)}
                onChange={() => handleCheckbox('cities', c)}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter 2: Domain */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Specialization / Domain
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {domainsList.map((d) => (
            <label
              key={d}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#152B45] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(selectedFilters.domains || []).includes(d)}
                onChange={() => handleCheckbox('domains', d)}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <span>{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter 3: Work Mode */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Work Mode
        </label>
        <div className="space-y-1.5">
          {workModes.map((wm) => (
            <label
              key={wm}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#152B45] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(selectedFilters.workModes || []).includes(wm)}
                onChange={() => handleCheckbox('workModes', wm)}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <span>{wm}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter 4: Groups Cleared (For Articleship & Industrial) */}
      {category !== 'ca-jobs' && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Groups Cleared
          </label>
          <div className="space-y-1.5">
            {groupsList.map((g) => (
              <label
                key={g}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#152B45] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(selectedFilters.groups || []).includes(g)}
                  onChange={() => handleCheckbox('groups', g)}
                  className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filter 5: Firm / Entity Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Firm Type
        </label>
        <div className="space-y-1.5">
          {firmTypes.map((ft) => (
            <label
              key={ft}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#152B45] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(selectedFilters.firmTypes || []).includes(ft)}
                onChange={() => handleCheckbox('firmTypes', ft)}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <span>{ft}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block w-64 bg-white border border-[#DCE5ED] rounded-xl p-5 shadow-2xs h-fit sticky top-20">
        {content}
      </div>

      {/* Mobile Drawer / Bottom Sheet */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE5ED] mb-4">
                <h3 className="font-bold text-[#173B63]">Filter Vacancies</h3>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#DCE5ED] mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-[#173B63] text-white font-semibold text-sm rounded-lg shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
