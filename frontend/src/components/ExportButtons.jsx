import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ExportButtons Component
 * Provides CSV and PDF export functionality with loading states and modern UI
 * 
 * @param {Object} props
 * @param {Function} props.onExportCSV - Function to call for CSV export
 * @param {Function} props.onExportPDF - Function to call for PDF export
 * @param {boolean} props.disabled - Whether buttons are disabled
 * @param {string} props.className - Additional CSS classes
 */
const ExportButtons = ({ 
  onExportCSV, 
  onExportPDF, 
  disabled = false,
  className = '' 
}) => {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleCSVExport = async () => {
    if (disabled || isExportingCSV) return;
    
    setIsExportingCSV(true);
    const loadingToast = toast.loading('Generating CSV file...');
    
    try {
      const result = await onExportCSV();
      
      if (result.success) {
        toast.success(result.message || 'CSV exported successfully!', {
          id: loadingToast,
          duration: 3000
        });
      } else {
        toast.error(result.message || 'Failed to export CSV', {
          id: loadingToast,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('An error occurred while exporting CSV', {
        id: loadingToast,
        duration: 4000
      });
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handlePDFExport = async () => {
    if (disabled || isExportingPDF) return;
    
    setIsExportingPDF(true);
    const loadingToast = toast.loading('Generating PDF file...');
    
    try {
      const result = await onExportPDF();
      
      if (result.success) {
        toast.success(result.message || 'PDF exported successfully!', {
          id: loadingToast,
          duration: 3000
        });
      } else {
        toast.error(result.message || 'Failed to export PDF', {
          id: loadingToast,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('An error occurred while exporting PDF', {
        id: loadingToast,
        duration: 4000
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Export Label */}
      <div className="flex items-center gap-2 text-gray-600">
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Export:</span>
      </div>

      {/* CSV Export Button */}
      <button
        onClick={handleCSVExport}
        disabled={disabled || isExportingCSV}
        className={`
          group relative flex items-center gap-2 px-4 py-2 
          bg-white border border-gray-300 rounded-lg
          text-sm font-medium text-gray-700
          transition-all duration-200
          hover:border-green-500 hover:text-green-600 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
          disabled:hover:text-gray-700 disabled:hover:shadow-none
          ${isExportingCSV ? 'cursor-wait' : ''}
        `}
        aria-label="Export to CSV"
      >
        <FileSpreadsheet className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isExportingCSV ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">
          {isExportingCSV ? 'Exporting...' : 'CSV'}
        </span>
        
        {/* Tooltip for mobile */}
        <span className="sm:hidden absolute -top-8 left-1/2 transform -translate-x-1/2 
          bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Export CSV
        </span>
      </button>

      {/* PDF Export Button */}
      <button
        onClick={handlePDFExport}
        disabled={disabled || isExportingPDF}
        className={`
          group relative flex items-center gap-2 px-4 py-2 
          bg-white border border-gray-300 rounded-lg
          text-sm font-medium text-gray-700
          transition-all duration-200
          hover:border-red-500 hover:text-red-600 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
          disabled:hover:text-gray-700 disabled:hover:shadow-none
          ${isExportingPDF ? 'cursor-wait' : ''}
        `}
        aria-label="Export to PDF"
      >
        <FileText className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isExportingPDF ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">
          {isExportingPDF ? 'Exporting...' : 'PDF'}
        </span>
        
        {/* Tooltip for mobile */}
        <span className="sm:hidden absolute -top-8 left-1/2 transform -translate-x-1/2 
          bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Export PDF
        </span>
      </button>
    </div>
  );
};

export default ExportButtons;

