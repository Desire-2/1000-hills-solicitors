'use client';

import ClientLayout from '@/components/client/ClientLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Role, Case } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Eye, Trash2, Search, Filter, FolderOpen, RefreshCw, AlertTriangle, X, File } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import apiService from '@/lib/api';
import { formatDate } from '@/lib/date-utils';

interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  case_id?: number;
  case_title?: string;
  case_reference?: string;
  uploaded_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

function DocumentsContent() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocumentsData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch cases first
      const casesResponse = await apiService.getCases();
      if (casesResponse.error) {
        throw new Error(casesResponse.error);
      }
      
      const casesData = (casesResponse.data as Case[]) || [];
      setCases(casesData);
      
      // Try to fetch documents - if endpoint doesn't exist, use empty array
      try {
        const docsResponse = await apiService.getDocuments();
        if (!docsResponse.error && docsResponse.data) {
          const docsData = Array.isArray(docsResponse.data) ? docsResponse.data : [];
          
          // Enrich documents with case information
          const enrichedDocs = docsData.map((doc: any) => ({
            ...doc,
            case_title: doc.case_id ? casesData.find(c => c.id === doc.case_id)?.title : undefined,
            case_reference: doc.case_id ? `CASE-${String(doc.case_id).padStart(4, '0')}` : undefined,
          }));
          
          setDocuments(enrichedDocs);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.warn('Documents endpoint not available:', err);
        setDocuments([]);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      setError(errorMessage);
      console.error('Documents fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocumentsData();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (selectedCaseId) {
        formData.append('case_id', selectedCaseId.toString());
      }
      
      const response = await apiService.uploadDocument(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Reset and refresh
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedCaseId(null);
      await fetchDocumentsData();
      
      alert('Document uploaded successfully!');
      
    } catch (err) {
      console.error('Upload error:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload document. Feature may not be available yet.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: number, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    
    try {
      const response = await apiService.deleteDocument(documentId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      await fetchDocumentsData();
      alert('Document deleted successfully!');
      
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleDownload = async (documentId: number, filename: string) => {
    try {
      const blob = await apiService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download document. Feature may not be available yet.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryFromMimeType = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
    return 'Other';
  };

  // Calculate statistics
  const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const documentsByCase = documents.reduce((acc, doc) => {
    if (doc.case_id) {
      acc[doc.case_id] = (acc[doc.case_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.case_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.case_reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    const category = getCategoryFromMimeType(doc.mime_type).toLowerCase();
    return matchesSearch && category === selectedCategory.toLowerCase();
  });

  const stats = [
    { label: 'Total Documents', value: documents.length.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Storage Used', value: formatFileSize(totalSize), icon: FolderOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cases with Docs', value: Object.keys(documentsByCase).length.toString(), icon: File, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-1000-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage and access your case documents</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-1000-blue hover:bg-1000-blue/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">{error}</p>
                <p className="text-xs text-yellow-700 mt-1">
                  The documents feature may not be fully configured yet. Showing available data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bg} rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="document">Documents</option>
                <option value="image">Images</option>
                <option value="archive">Archives</option>
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No documents found' : 'No Documents Yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search' : 'Upload your first document to get started'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-1000-blue hover:bg-1000-blue/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-1000-blue mr-3 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                            <p className="text-xs text-gray-500">{getCategoryFromMimeType(doc.mime_type)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doc.case_reference ? (
                          <div>
                            <p className="text-sm font-medium text-1000-blue">{doc.case_reference}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{doc.case_title}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatFileSize(doc.file_size || 0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{doc.uploaded_by.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(doc.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDownload(doc.id, doc.filename)}
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id, doc.filename)}
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setSelectedCaseId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Associate with Case (Optional)
              </label>
              <select
                value={selectedCaseId || ''}
                onChange={(e) => setSelectedCaseId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue focus:border-transparent"
              >
                <option value="">No Case Association</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    CASE-{String(c.id).padStart(4, '0')} - {c.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setSelectedCaseId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-1000-blue hover:bg-1000-blue/90"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}

export default function Documents() {
  return (
    <ProtectedRoute requiredRole={[Role.CLIENT]}>
      <DocumentsContent />
    </ProtectedRoute>
  );
}
