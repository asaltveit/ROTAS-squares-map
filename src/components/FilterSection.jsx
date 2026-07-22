import { useEffect, useState, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { X } from 'lucide-react';
import { convertStringsToOptions } from '@/utilities/UtilityFunctions.js';
import { yearTypeOptions } from '@/constants'
import { useMapStore } from '@/stores/MapStore.js'
import { useFilterStore } from '@/stores/FilterStore.js'
import { supabase } from '@/supabaseClient';

/*
TODO: 
- Should individual filters be memoized?
     - especially when timeline is running?


*/

export default function FilterSection({ onClose }) {
    const scrollContainerRef = useRef(null);
    
    // Local state for number inputs to allow multi-digit typing
    const [startYearInput, setStartYearInput] = useState('');
    const [endYearInput, setEndYearInput] = useState('');

    const { locationTypes } = useMapStore(
        useShallow((state) => ({ 
          locationTypes: state.locationTypes,
        })),
      )

    const { 
        scripts,
        firstWords,

        setPlaces,
        setFirstWords,
        setScripts,
        setTexts,
        setLocs,

        type,
        script,
        firstWord,
        yearType,
        timelineStart,
        timelineEnd,
        timelineYear,
        setTimelineStart,
        setTimelineEnd,

        setTypeFilter,
        setScriptFilter,
        setFirstWordFilter,
        setYearType,
        clearFilters, 
    } = useFilterStore(
        useShallow((state) => ({ 
            scripts: state.scripts,
            firstWords: state.firstWords,

            setPlaces: state.setPlaces,
            setFirstWords: state.setFirstWords,
            setScripts: state.setScripts,
            setTexts: state.setTexts,
            setLocs: state.setLocs,

            setTypeFilter: state.setTypeFilter,
            setScriptFilter: state.setScriptFilter,
            setFirstWordFilter: state.setFirstWordFilter,
            setYearType: state.setYearType,
            clearFilters: state.clearFilters,

            type: state.filters.location_type,
            script: state.filters.script,
            firstWord: state.filters.first_word,
            yearType: state.yearType,
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
            timelineYear: state.timelineYear,
            setTimelineStart: state.setTimelineStart,
            setTimelineEnd: state.setTimelineEnd,
        })),
    )

    useEffect(() => {
        let cancelled = false;

        async function loadFilterOptions() {
            const [
                scriptsResult,
                locationsResult,
                textsResult,
                placesResult,
                firstWordsResult,
            ] = await Promise.all([
                supabase.rpc('get_distinct_script'),
                supabase.rpc('get_distinct_location'),
                supabase.rpc('get_distinct_text'),
                supabase.rpc('get_distinct_place'),
                supabase.rpc('get_distinct_first_word'),
            ]);

            if (cancelled) {
                return;
            }

            if (scriptsResult.error) {
                console.error("getScripts error: ", scriptsResult.error)
            } else {
                setScripts(convertStringsToOptions(scriptsResult.data));
            }

            if (locationsResult.error) {
                console.error("getLocations error: ", locationsResult.error)
            } else {
                setLocs(convertStringsToOptions(locationsResult.data));
            }

            if (textsResult.error) {
                console.error("getTexts error: ", textsResult.error)
            } else {
                setTexts(convertStringsToOptions(textsResult.data));
            }

            if (placesResult.error) {
                console.error("getPlaces error: ", placesResult.error)
            } else {
                setPlaces(convertStringsToOptions(placesResult.data));
            }

            if (firstWordsResult.error) {
                console.error("getFirstWords error: ", firstWordsResult.error)
            } else {
                setFirstWords(convertStringsToOptions(firstWordsResult.data));
            }
        }

        loadFilterOptions().catch((error) => {
            if (!cancelled) {
                console.error('loadFilterOptions error: ', error);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [setScripts, setLocs, setTexts, setPlaces, setFirstWords]);

    const clearAllFilters = () => {
        clearFilters()
    }

    // Helper function to normalize select value - ensure it's always a string and matches an option
    const normalizeSelectValue = (value, options = []) => {
        // Convert to string, handle null/undefined
        const stringValue = (value === null || value === undefined) ? "" : String(value);
        
        // If empty string, it's always valid (for "All..." options)
        if (stringValue === "") return "";
        
        // If no options loaded yet, return empty string to show default option
        // This prevents React from showing an invalid state
        if (!options || options.length === 0) return "";
        
        // Verify the value exists in the options
        const optionValues = options.map(opt => {
            if (typeof opt === 'string') return opt;
            return String(opt.value || opt);
        });
        
        // If value matches an option, return it; otherwise return empty string
        if (optionValues.includes(stringValue)) {
            return stringValue;
        }
        
        // Value doesn't match - return empty string to show default
        return "";
    };

    // Memoize option arrays to prevent unnecessary recalculations
    const typeOptions = useMemo(() => convertStringsToOptions(locationTypes || []), [locationTypes]);

    // Helper function to create onChange handler for select dropdowns
    const createSelectChangeHandler = (setter, normalizeToEmpty = true) => {
        return (e) => {
            const newValue = normalizeToEmpty ? (e.target.value || "") : e.target.value;
            setter(newValue);
        };
    };

    // Helper function to create onKeyDown handler for select dropdowns
    const createSelectKeyDownHandler = (setter, normalizeToEmpty = true) => {
        return (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const newValue = normalizeToEmpty ? (e.target.value || "") : e.target.value;
                setter(newValue);
            }
        };
    };

    // Sync local input state with store values, but only when not focused
    const startYearInputRef = useRef(null);
    const endYearInputRef = useRef(null);

    useEffect(() => {
        // Only update if input is not focused
        if (document.activeElement !== startYearInputRef.current) {
            queueMicrotask(() => {
                setStartYearInput(timelineStart?.toString() || '0');
            });
        }
    }, [timelineStart]);

    useEffect(() => {
        // Only update if input is not focused
        if (document.activeElement !== endYearInputRef.current) {
            queueMicrotask(() => {
                setEndYearInput(timelineEnd?.toString() || '2100');
            });
        }
    }, [timelineEnd]);

    // Preserve scroll position when timeline state changes (but not when user is typing)
    const isInitialMount = useRef(true);
    const savedScrollTop = useRef(0);
    const isUserTyping = useRef(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Don't preserve scroll if user is actively typing in number inputs
        if (isUserTyping.current) {
            return;
        }

        // Save scroll position before state updates
        savedScrollTop.current = scrollContainer.scrollTop;
        
        // Restore scroll position after React finishes rendering
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (scrollContainer && !isUserTyping.current && scrollContainer.scrollTop !== savedScrollTop.current) {
                    scrollContainer.scrollTop = savedScrollTop.current;
                }
            });
        });
    }, [timelineStart, timelineEnd, timelineYear]);

    return (
        <div className="flex flex-col min-w-0 self-start w-full">
            <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 flex flex-col overflow-hidden max-h-[calc(100vh-4rem)]">
                <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 pb-3 lg:pb-4 border-b-2 border-amber-800 flex-shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-amber-900">
                        Filters
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-amber-100 rounded transition-colors"
                            title="Close filters"
                            aria-label="Close filters"
                        >
                            <X size={20} className="text-amber-800" />
                        </button>
                    )}
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-3 lg:pt-4 space-y-4">
                {/* Temporal Range */}
                <fieldset className="space-y-2 border-0 p-0 m-0 min-w-0">
                    <legend className="block text-sm font-semibold text-amber-900 mb-2 px-0">Temporal Range</legend>
                    <div className="space-y-4">
                        <div className="text-sm text-amber-900">
                            {timelineStart} CE - {timelineEnd} CE
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="start-year-input" className="text-xs text-amber-700">Start Year</label>
                                <input
                                    id="start-year-input"
                                    ref={startYearInputRef}
                                    type="number"
                                    min="-100"
                                    max={timelineEnd - 1}
                                    value={startYearInput}
                                    onFocus={() => {
                                        isUserTyping.current = true;
                                    }}
                                    onChange={(e) => {
                                        // Allow typing without immediately updating store
                                        setStartYearInput(e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        isUserTyping.current = false;
                                        // Update store only when user finishes typing
                                        const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                                        if (!isNaN(val)) {
                                            const newStart = Math.min(val, timelineEnd - 1);
                                            setTimelineStart(newStart);
                                            setStartYearInput(newStart.toString());
                                        } else {
                                            setStartYearInput(timelineStart?.toString() || '0');
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Update store on Enter key
                                        if (e.key === 'Enter') {
                                            isUserTyping.current = false;
                                            e.target.blur();
                                        }
                                    }}
                                    className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="end-year-input" className="text-xs text-amber-700">End Year</label>
                                <input
                                    id="end-year-input"
                                    ref={endYearInputRef}
                                    type="number"
                                    min={timelineStart + 1}
                                    max="500"
                                    value={endYearInput}
                                    onFocus={() => {
                                        isUserTyping.current = true;
                                    }}
                                    onChange={(e) => {
                                        // Allow typing without immediately updating store
                                        setEndYearInput(e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        isUserTyping.current = false;
                                        // Update store only when user finishes typing
                                        const val = e.target.value === '' ? 2100 : parseInt(e.target.value, 10);
                                        if (!isNaN(val)) {
                                            const newEnd = Math.max(val, timelineStart + 1);
                                            setTimelineEnd(newEnd);
                                            setEndYearInput(newEnd.toString());
                                        } else {
                                            setEndYearInput(timelineEnd?.toString() || '2100');
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Update store on Enter key
                                        if (e.key === 'Enter') {
                                            isUserTyping.current = false;
                                            e.target.blur();
                                        }
                                    }}
                                    className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Year Type */}
                <div className="space-y-2">
                    <label htmlFor="year-type-select" className="block text-sm font-semibold text-amber-900">Year Type</label>
                    <select
                        id="year-type-select"
                        value={normalizeSelectValue(yearType, yearTypeOptions) || "created"}
                        onChange={createSelectChangeHandler(setYearType, false)}
                        onKeyDown={createSelectKeyDownHandler(setYearType, false)}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        {yearTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <label htmlFor="type-select" className="block text-sm font-semibold text-amber-900">Type</label>
                    <select
                        id="type-select"
                        value={normalizeSelectValue(type, typeOptions)}
                        onChange={createSelectChangeHandler(setTypeFilter)}
                        onKeyDown={createSelectKeyDownHandler(setTypeFilter)}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All Types</option>
                        {typeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                {/* Script */}
                <div className="space-y-2">
                    <label htmlFor="script-select" className="block text-sm font-semibold text-amber-900">Script</label>
                    <select
                        id="script-select"
                        value={normalizeSelectValue(script, scripts)}
                        onChange={createSelectChangeHandler(setScriptFilter)}
                        onKeyDown={createSelectKeyDownHandler(setScriptFilter)}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All Scripts</option>
                        {scripts.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                {/* First Word */}
                <div className="space-y-2">
                    <label htmlFor="first-word-select" className="block text-sm font-semibold text-amber-900">First Word</label>
                    <select
                        id="first-word-select"
                        value={normalizeSelectValue(firstWord, firstWords)}
                        onChange={createSelectChangeHandler(setFirstWordFilter)}
                        onKeyDown={createSelectKeyDownHandler(setFirstWordFilter)}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All First Words</option>
                        {firstWords.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                {/* Removing these for now - these options don't seem very helpful
                    Could also remove First Word
                Text 
                <div className="space-y-2">
                    <label htmlFor="text-select" className="block text-sm font-semibold text-amber-900">Text</label>
                    <select
                        id="text-select"
                        value={normalizeSelectValue(text, texts)}
                        onChange={(e) => {
                            const newValue = e.target.value || "";
                            setTextFilter(newValue);
                        }}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All Texts</option>
                        {texts.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                /* Place 
                <div className="space-y-2">
                    <label htmlFor="place-select" className="block text-sm font-semibold text-amber-900">Place</label>
                    <select
                        id="place-select"
                        value={normalizeSelectValue(place, places)}
                        onChange={(e) => {
                            const newValue = e.target.value || "";
                            setPlaceFilter(newValue);
                        }}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All Places</option>
                        {places.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>

                /* Location 
                <div className="space-y-2">
                    <label htmlFor="location-select" className="block text-sm font-semibold text-amber-900">Location</label>
                    <select
                        id="location-select"
                        value={normalizeSelectValue(location, locs)}
                        onChange={(e) => {
                            const newValue = e.target.value || "";
                            setLocationFilter(newValue);
                        }}
                        className="w-full px-3 py-2 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
                    >
                        <option value="">All Locations</option>
                        {locs.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.title}</option>
                        ))}
                    </select>
                </div>*/}

                <button
                    onClick={clearAllFilters}
                    className="w-full mt-4 px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                >
                    <X size={18} />
                    Clear All Filters
                </button>
                </div>
            </div>
        </div>
    );
}
