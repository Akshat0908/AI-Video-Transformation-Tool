import React, { useEffect, useState } from 'react';
import { Clock, Search, ChevronDown, Download, Eye, Calendar, FileVideo } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { TransformationHistoryItem } from '../types';
import { fetchTransformationHistory } from '../services/api';

const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<TransformationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TransformationHistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchTransformationHistory();
        setHistoryItems(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredItems = historyItems.filter(item => 
    item.sourceVideoName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const nameA = a.sourceVideoName.toLowerCase();
      const nameB = b.sourceVideoName.toLowerCase();
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    }
  });

  const toggleSort = (type: 'date' | 'name') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Transformation History
            </h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by video name"
                className="pl-10 pr-4 py-2 bg-[#1e293b] border border-[#334155] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-bar w-32"></div>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-16 bg-[#1e293b] rounded-lg border border-[#334155]">
            <Clock className="mx-auto h-12 w-12 text-[#64748b] mb-4" />
            <h2 className="text-xl font-semibold mb-2">No transformation history yet</h2>
            <p className="text-[#94a3b8] max-w-md mx-auto">
              Once you transform videos, they will appear here. Go to the transformation page to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-[#1e293b] rounded-lg border border-[#334155] overflow-hidden">
                <div className="p-4 border-b border-[#334155] flex justify-between items-center">
                  <h2 className="font-medium">Recent Transformations</h2>
                  <div className="flex gap-2">
                    <button 
                      className="p-1 text-sm flex items-center gap-1 text-[#94a3b8] hover:text-white"
                      onClick={() => toggleSort('date')}
                    >
                      Date
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${
                          sortBy === 'date' && sortOrder === 'asc' ? 'rotate-180' : ''
                        } ${sortBy === 'date' ? 'text-white' : ''}`} 
                      />
                    </button>
                    <button 
                      className="p-1 text-sm flex items-center gap-1 text-[#94a3b8] hover:text-white"
                      onClick={() => toggleSort('name')}
                    >
                      Name
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${
                          sortBy === 'name' && sortOrder === 'asc' ? 'rotate-180' : ''
                        } ${sortBy === 'name' ? 'text-white' : ''}`} 
                      />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto">
                  {sortedItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-4 border-b border-[#334155] hover:bg-[#0f172a] transition-colors cursor-pointer ${
                        selectedItem?.id === item.id ? 'bg-[#0f172a]' : ''
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#0f172a] rounded-md p-1">
                          <FileVideo size={18} className="text-[#3b82f6]" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-medium text-sm text-white truncate">
                            {item.sourceVideoName}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar size={12} className="text-[#64748b]" />
                            <p className="text-xs text-[#94a3b8]">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedItem ? (
                <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedItem.sourceVideoName}</h2>
                      <p className="text-[#94a3b8] text-sm mt-1">
                        Transformed on {formatDate(selectedItem.createdAt)}
                      </p>
                    </div>
                    <a 
                      href={selectedItem.transformedVideoUrl}
                      download 
                      className="btn btn-primary text-sm"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-2 text-[#94a3b8] text-sm">Source Video</h3>
                      <div className="bg-[#0f172a] rounded-md overflow-hidden">
                        <VideoPlayer src={selectedItem.sourceVideoUrl} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-[#94a3b8] text-sm">Transformed Video</h3>
                      <div className="bg-[#0f172a] rounded-md overflow-hidden">
                        <VideoPlayer src={selectedItem.transformedVideoUrl} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 text-[#94a3b8] text-sm">Transformation Parameters</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(selectedItem.parameters).map(([key, value]) => (
                        <div key={key} className="bg-[#0f172a] p-3 rounded-md">
                          <p className="text-[#94a3b8] text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="font-medium text-sm">{value.toString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-6 flex flex-col items-center justify-center text-center h-full py-20">
                  <Eye className="h-12 w-12 text-[#64748b] mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a transformation</h3>
                  <p className="text-[#94a3b8] max-w-md">
                    Choose a transformation from the list to view details and compare the original and transformed videos.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;