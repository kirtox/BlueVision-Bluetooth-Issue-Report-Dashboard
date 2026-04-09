// src/sub-components/filters/ReportFilters.tsx
// import React, { useState } from 'react';
import React from 'react';
import { MultiSelect, Option } from 'react-multi-select-component';
// import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateFilter from "../filters/DateFilter";
// import { Download } from 'react-feather';

interface ReportFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  platformBrandOptions: string[];
  selectedPlatformBrands: string[];
  setSelectedPlatformBrands: (values: string[]) => void;

  platformOptions: string[];
  selectedPlatforms: string[];
  setSelectedPlatforms: (values: string[]) => void;

  cpuOptions: string[];
  selectedCPUs: string[];
  setSelectedCPUs: (values: string[]) => void;

  wlanOptions: string[];
  selectedWlans: string[];
  setSelectedWlans: (values: string[]) => void;

  scenarioOptions: string[];
  selectedScenarios: string[];
  setSelectedScenarios: (values: string[]) => void;

  btDriverOptions: string[];
  selectedBTDrivers: string[];
  setSelectedBTDrivers: (values: string[]) => void;

  resultOptions: string[];
  selectedResults: string[];
  setSelectedResults: (values: string[]) => void;

  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;

  onClear: () => void;
}

// Define API_BASE_URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  platformBrandOptions,
  selectedPlatformBrands,
  setSelectedPlatformBrands,
  platformOptions,
  selectedPlatforms,
  setSelectedPlatforms,
  cpuOptions,
  selectedCPUs,
  setSelectedCPUs,
  wlanOptions,
  selectedWlans,
  setSelectedWlans,
  scenarioOptions,
  selectedScenarios,
  setSelectedScenarios,
  btDriverOptions,
  selectedBTDrivers,
  setSelectedBTDrivers,
  resultOptions,
  selectedResults,
  setSelectedResults,
  dateRange,
  setDateRange,
  onClear,
}) => {
  // const [isExporting, setIsExporting] = useState(false);

  // const handleExportExcel = async () => {
  //   setIsExporting(true);
  //   try {
  //     // Build search parameters
  //     const params = new URLSearchParams();
      
  //     if (searchTerm) {
  //       params.append('search_term', searchTerm);
  //     }
      
  //     // if (selectedPlatformBrands.length > 0) {
  //     //   params.append('platform_brands', selectedPlatformBrands.join(','));
  //     // }

  //     if (selectedPlatforms.length > 0) {
  //       params.append('platforms', selectedPlatforms.join(','));
  //     }

  //     if (selectedWlans.length > 0) {
  //       params.append('wlans', selectedWlans.join(','));
  //     }

  //     if (selectedScenarios.length > 0) {
  //       params.append('scenarios', selectedScenarios.join(','));
  //     }

  //     if (selectedBTDrivers.length > 0) {
  //       params.append('bt_drivers', selectedBTDrivers.join(','));
  //     }
      
  //     if (selectedResults.length > 0) {
  //       params.append('results', selectedResults.join(','));
  //     }
      
  //     // if (selectedStatuses.length > 0) {
  //     //   params.append('statuses', selectedStatuses.join(','));
  //     // }
      
  //     if (dateRange.startDate) {
  //       params.append('start_date', dateRange.startDate.toISOString());
  //     }
      
  //     if (dateRange.endDate) {
  //       params.append('end_date', dateRange.endDate.toISOString());
  //     }
      
  //     // Send request
  //     // const response = await fetch(`http://localhost:8000/export/excel?${params.toString()}`);
  //     const response = await fetch(`${API_BASE_URL}/export/excel?${params.toString()}`);
      
      
  //     if (!response.ok) {
  //       throw new Error('Export failed');
  //     }
      
  //     // Download file
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `reports_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
      
  //   } catch (error) {
  //     console.error('Export error:', error);
  //     alert('Export failed. Please try again.');
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-auto"
        />

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={platformBrandOptions.map(pb => ({ label: pb, value: pb }))}
          value={selectedPlatformBrands.map(pb => ({ label: pb, value: pb }))}
          onChange={(selected: Option[]) => setSelectedPlatformBrands(selected.map(s => s.value))}
          labelledBy="Select Platform Brands"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Platform Brands' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={platformOptions.map(p => ({ label: p, value: p }))}
          value={selectedPlatforms.map(p => ({ label: p, value: p }))}
          onChange={(selected: Option[]) => setSelectedPlatforms(selected.map(s => s.value))}
          labelledBy="Select Platforms"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Platforms' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={cpuOptions.map(p => ({ label: p, value: p }))}
          value={selectedCPUs.map(p => ({ label: p, value: p }))}
          onChange={(selected: Option[]) => setSelectedCPUs(selected.map(s => s.value))}
          labelledBy="Select CPUs"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select CPUs' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={wlanOptions.map(w => ({ label: w, value: w }))}
          value={selectedWlans.map(w => ({ label: w, value: w }))}
          onChange={(selected: Option[]) => setSelectedWlans(selected.map(s => s.value))}
          labelledBy="Select WLANs"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select WLANs' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={scenarioOptions.map(s => ({ label: s, value: s }))}
          value={selectedScenarios.map(s => ({ label: s, value: s }))}
          onChange={(selected: Option[]) => setSelectedScenarios(selected.map(s => s.value))}
          labelledBy="Select Scenarios"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Scenarios' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={btDriverOptions.map(b => ({ label: b, value: b }))}
          value={selectedBTDrivers.map(b => ({ label: b, value: b }))}
          onChange={(selected: Option[]) => setSelectedBTDrivers(selected.map(s => s.value))}
          labelledBy="Select BT Drivers"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select BT Drivers' }}
          />
        </div>

        <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={resultOptions.map(r => ({ label: r, value: r }))}
          value={selectedResults.map(r => ({ label: r, value: r }))}
          onChange={(selected: Option[]) => setSelectedResults(selected.map(s => s.value))}
          labelledBy="Select Results"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Results' }}
          />
        </div>

        {/* <div className="w-auto flex-shrink-0" style={{ minWidth: 240 }}>
          <MultiSelect
          options={statusOptions.map(s => ({ label: s, value: s }))}
          value={selectedStatuses.map(s => ({ label: s, value: s }))}
          onChange={(selected: Option[]) => setSelectedStatuses(selected.map(s => s.value))}
          labelledBy="Select Status"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Status' }}
          />
        </div> */}

        {/* <DateRange
        ranges=[{
            startDate: dateRange.startDate || new Date(),
            endDate: dateRange.endDate || new Date(),
            key: 'selection',
        }]}
        onChange={(item: RangeKeyDict) => {
            const { startDate, endDate } = item.selection;
            setDateRange({ startDate, endDate });
        }}
        className="bg-white border p-2 rounded shadow-sm"
        /> */}


        <DateFilter
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(range) => setDateRange(range)}
        />

        <button className="btn btn-outline-secondary" onClick={onClear}>Clear All</button>
        
        {/* <button 
          className="btn btn-success d-flex align-items-center gap-2" 
          onClick={handleExportExcel}
          disabled={isExporting}
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </button> */}
    </div>
  );
};

export default ReportFilters;
