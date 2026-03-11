import React from "react";
import { MultiSelect, Option } from 'react-multi-select-component';
import { APIAccessLog } from "types";
import DateFilter from "../filters/DateFilter";

interface APIAccessLogFiltersProps {
  logs: APIAccessLog[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMethods: string[];
  setSelectedMethods: (methods: string[]) => void;
  selectedStatusCodes: string[];
  setSelectedStatusCodes: (codes: string[]) => void;
  selectedEndpoints: string[];
  setSelectedEndpoints: (endpoints: string[]) => void;

  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onClearFilters: () => void;
}

const APIAccessLogFilters: React.FC<APIAccessLogFiltersProps> = ({
  logs,
  searchTerm,
  setSearchTerm,
  selectedMethods,
  setSelectedMethods,
  selectedStatusCodes,
  setSelectedStatusCodes,
  selectedEndpoints,
  setSelectedEndpoints,

  dateRange,
  setDateRange,
  onClearFilters,
}) => {
  // Function to normalize endpoints by replacing IDs with patterns
  const normalizeEndpoint = (endpoint: string): string => {
    // Replace numeric IDs with {id} pattern
    // Examples: /reports/123 -> /reports/{id}, /users/456/posts/789 -> /users/{id}/posts/{id}
    return endpoint.replace(/\/\d+/g, '/{id}');
  };

  // Get unique values for filter options
  const uniqueMethods = [...new Set(logs.map(log => log.method))].sort();
  const uniqueStatusCodes = [...new Set(logs.map(log => log.response_status?.toString()).filter(Boolean))].sort() as string[];
  
  // Normalize endpoints and get unique patterns
  const normalizedEndpoints = [...new Set(logs.map(log => normalizeEndpoint(log.endpoint)))].sort();

  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-auto"
      />

      {/* HTTP Methods */}
      <div className="w-auto flex-shrink-0" style={{ minWidth: 200 }}>
        <MultiSelect
          options={uniqueMethods.map(method => ({ label: method, value: method }))}
          value={selectedMethods.map(method => ({ label: method, value: method }))}
          onChange={(selected: Option[]) => setSelectedMethods(selected.map(s => s.value))}
          labelledBy="Select HTTP Methods"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select HTTP Methods' }}
        />
      </div>

      {/* Status Codes */}
      <div className="w-auto flex-shrink-0" style={{ minWidth: 200 }}>
        <MultiSelect
          options={uniqueStatusCodes.map(code => ({ label: code, value: code }))}
          value={selectedStatusCodes.map(code => ({ label: code, value: code }))}
          onChange={(selected: Option[]) => setSelectedStatusCodes(selected.map(s => s.value))}
          labelledBy="Select Status Codes"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Status Codes' }}
        />
      </div>

      {/* Endpoints */}
      <div className="w-auto flex-shrink-0" style={{ minWidth: 250 }}>
        <MultiSelect
          options={normalizedEndpoints.slice(0, 50).map(endpoint => ({ 
            label: endpoint.length > 40 ? `${endpoint.substring(0, 40)}...` : endpoint, 
            value: endpoint 
          }))}
          value={selectedEndpoints.map(endpoint => ({ 
            label: endpoint.length > 40 ? `${endpoint.substring(0, 40)}...` : endpoint, 
            value: endpoint 
          }))}
          onChange={(selected: Option[]) => setSelectedEndpoints(selected.map(s => s.value))}
          labelledBy="Select Endpoints"
          className="w-auto"
          overrideStrings={{ selectSomeItems: 'Select Endpoints' }}
        />
      </div>

      {/* Date Range */}
      <DateFilter
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDateChange={(range) => setDateRange(range)}
      />

      {/* Clear All Button */}
      <button className="btn btn-outline-secondary" onClick={onClearFilters}>
        Clear All
      </button>
    </div>
  );
};

export default APIAccessLogFilters;