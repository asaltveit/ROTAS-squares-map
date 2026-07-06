import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { X, Download, Share, Bookmark, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterStore } from '@/stores/FilterStore';

export default function RecordingExportSection({ onClose }) {
  const { filters } = useFilterStore(
    useShallow((state) => ({
      filters: state.filters,
    })),
  );

  const [recording, setRecording] = useState({
    isRecording: false,
    isPaused: false,
    savedViews: [],
    bookmarked: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    recording: false,
    export: false,
    savedViews: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const saveView = () => {
    const view = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      filters: { ...filters },
    };
    setRecording((prev) => ({
      ...prev,
      savedViews: [...prev.savedViews, view],
    }));
  };

  return (
    <div className="flex flex-col min-w-0 self-start w-full text-left">
      <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 flex flex-col overflow-hidden max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 pb-3 lg:pb-4 border-b-2 border-amber-800 flex-shrink-0">
          <h2 className="text-xl font-serif font-bold text-amber-900">
            Recording & Export
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-amber-100 rounded transition-colors"
              title="Close recording and export"
              aria-label="Close recording and export"
            >
              <X size={20} className="text-amber-800" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-3 lg:pt-4 space-y-3">
          {/* Recording Controls */}
          <div>
            <button
              onClick={() => toggleSection('recording')}
              className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
              aria-expanded={expandedSections.recording}
            >
              <h3 className="text-lg font-serif font-bold text-amber-900">
                Recording Session
              </h3>
              {expandedSections.recording ? (
                <ChevronUp size={20} className="text-amber-900" />
              ) : (
                <ChevronDown size={20} className="text-amber-900" />
              )}
            </button>

            {expandedSections.recording && (
              <div className="mt-4">
                <div className="border-t-2 border-amber-200 my-4"></div>

                <button
                  onClick={saveView}
                  className="w-full mb-2 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center justify-start gap-2"
                >
                  <Save size={18} />
                  Save Current View
                </button>

                <button
                  onClick={() => setRecording((prev) => ({ ...prev, bookmarked: !prev.bookmarked }))}
                  className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-start gap-2"
                >
                  <Bookmark size={18} fill={recording.bookmarked ? 'currentColor' : 'none'} />
                  {recording.bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            )}
          </div>

          {/* Export & Share */}
          <div>
            <button
              onClick={() => toggleSection('export')}
              className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
              aria-expanded={expandedSections.export}
            >
              <h3 className="text-lg font-serif font-bold text-amber-900">
                Export & Share
              </h3>
              {expandedSections.export ? (
                <ChevronUp size={20} className="text-amber-900" />
              ) : (
                <ChevronDown size={20} className="text-amber-900" />
              )}
            </button>

            {expandedSections.export && (
              <div className="space-y-2 mt-4">
                <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-start gap-2">
                  <Download size={18} />
                  Export as CSV
                </button>
                <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-start gap-2">
                  <Download size={18} />
                  Export as PDF
                </button>
                <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-start gap-2">
                  <Share size={18} />
                  Share Configuration
                </button>
              </div>
            )}
          </div>

          {/* Saved Views */}
          {recording.savedViews.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('savedViews')}
                className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
                aria-expanded={expandedSections.savedViews}
              >
                <h3 className="text-lg font-serif font-bold text-amber-900">
                  Saved Views ({recording.savedViews.length})
                </h3>
                {expandedSections.savedViews ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {expandedSections.savedViews && (
                <div className="max-h-48 overflow-y-auto space-y-2 mt-4">
                  {recording.savedViews.map((view) => (
                    <div
                      key={view.id}
                      className="p-3 bg-amber-50 border border-amber-200 rounded"
                    >
                      <p className="text-sm text-amber-900">{view.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
