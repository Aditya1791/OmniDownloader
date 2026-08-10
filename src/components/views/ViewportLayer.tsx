import React, { useState } from 'react';

interface ViewportLayerProps {
  isDarkMode: boolean;
}

export const ViewportLayer: React.FC<ViewportLayerProps> = ({ isDarkMode }) => {
  const [toggleActive, setToggleActive] = useState(true);
  const [inputText, setInputText] = useState('STARK MINIMAL SYSTEM');
  const [selectedTab, setSelectedTab] = useState<'LAYOUT' | 'COMPONENTS' | 'CODE'>('COMPONENTS');
  const [sliderValue, setSliderValue] = useState(75);

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Manifest Layer: viewport_layer
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [STATUS: ACTIVE]
          </span>
        </div>

        <h1 className="font-oswald text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight uppercase -ml-1">
          Viewport
        </h1>

        <p className="font-sans font-light text-sm md:text-lg uppercase tracking-tight mt-2 max-w-xl">
          Live Wireframe Canvas & Modular Component Test Bench
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="my-6 border-b-[1.5px] border-current flex gap-0 font-mono-custom text-xs">
        {(['COMPONENTS', 'LAYOUT', 'CODE'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 border-t-[1.5px] border-x-[1.5px] ${borderClass} -mb-[1.5px] uppercase font-bold cursor-pointer ${
              selectedTab === tab
                ? isDarkMode
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : 'bg-transparent text-neutral-500 hover:text-current'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {selectedTab === 'COMPONENTS' && (
        <div className="space-y-8 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interactive Buttons Showcase */}
            <div className={`border-[1.5px] ${borderClass} p-6 space-y-4`}>
              <span className="font-mono-custom text-xs font-bold uppercase tracking-widest block text-neutral-500">
                01. Button Archetypes
              </span>
              <div className="flex flex-wrap gap-3">
                <button className={`px-6 py-3 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} font-sans font-bold text-xs uppercase tracking-widest cursor-pointer`}>
                  Primary Button
                </button>
                <button className={`px-6 py-3 border-[1.5px] ${borderClass} font-mono-custom font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black`}>
                  Outline Button
                </button>
              </div>
            </div>

            {/* Interactive Input & Controls Showcase */}
            <div className={`border-[1.5px] ${borderClass} p-6 space-y-4`}>
              <span className="font-mono-custom text-xs font-bold uppercase tracking-widest block text-neutral-500">
                02. Form Controls
              </span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`w-full p-3 border-[1.5px] ${borderClass} bg-transparent font-mono-custom text-xs uppercase tracking-wider outline-none`}
              />
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono-custom text-xs">TOGGLE STATE:</span>
                <button
                  onClick={() => setToggleActive(!toggleActive)}
                  className={`px-4 py-1 border-[1.5px] ${borderClass} font-mono-custom text-xs font-bold uppercase cursor-pointer ${
                    toggleActive ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : 'bg-transparent'
                  }`}
                >
                  {toggleActive ? 'ON [1]' : 'OFF [0]'}
                </button>
              </div>
            </div>
          </div>

          {/* Range Slider & Metric Card */}
          <div className={`border-[1.5px] ${borderClass} p-6 space-y-4`}>
            <div className="flex justify-between items-center">
              <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500">
                03. Range Slider & Intensity
              </span>
              <span className="font-oswald text-2xl font-bold">{sliderValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full accent-black dark:accent-white cursor-pointer"
            />
          </div>
        </div>
      )}

      {selectedTab === 'LAYOUT' && (
        <div className={`border-[1.5px] ${borderClass} p-6 space-y-4 my-4`}>
          <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 block">
            Grids & Wireframe Structural Geometry
          </span>
          <div className="grid grid-cols-12 gap-2 h-32">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`border-[1.5px] ${borderClass} flex items-center justify-center font-mono-custom text-[10px] font-bold`}
              >
                C{i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'CODE' && (
        <div className={`border-[1.5px] ${borderClass} p-6 my-4 font-mono-custom text-xs space-y-2 overflow-x-auto`}>
          <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2 border-b-[1.5px] border-current pb-2">
            manifest/viewport_layer.json
          </div>
          <pre className="text-xs">
{`{
  "layer": "viewport_layer",
  "archetype": "stark_minimal",
  "fonts": ["Oswald", "Inter", "Space Mono"],
  "borders": "1.5px solid var(--ink)",
  "state": {
    "toggle": ${toggleActive},
    "text": "${inputText}",
    "slider": ${sliderValue}
  }
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
