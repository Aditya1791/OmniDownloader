import React, { useState } from 'react';

interface StyleDefinitionProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const StyleDefinition: React.FC<StyleDefinitionProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [borderWidth, setBorderWidth] = useState<string>('1.5px');

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Manifest Layer: style_definition
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [THEME: STARK_MINIMAL]
          </span>
        </div>

        <h1 className="font-oswald text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight uppercase -ml-1">
          Styles
        </h1>

        <p className="font-sans font-light text-sm md:text-lg uppercase tracking-tight mt-2 max-w-xl">
          Typographic Specifications & Stark Monochromatic Matrix
        </p>
      </div>

      <div className="my-6 space-y-8">
        {/* Typography Matrix */}
        <div className={`border-[1.5px] ${borderClass} p-6 space-y-6`}>
          <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 block">
            01. Typographic Hierarchy
          </span>

          <div className="border-b-[1.5px] border-current pb-4">
            <span className="font-mono-custom text-[10px] uppercase text-neutral-400 block mb-1">
              DISPLAY FONT — OSWALD (500/700 UPPERCASE)
            </span>
            <div className="font-oswald text-4xl sm:text-6xl uppercase tracking-tight font-bold">
              STARK MINIMAL ARCHETYPE
            </div>
          </div>

          <div className="border-b-[1.5px] border-current pb-4">
            <span className="font-mono-custom text-[10px] uppercase text-neutral-400 block mb-1">
              BODY FONT — INTER (300/400 UPPERCASE)
            </span>
            <p className="font-sans font-light text-base tracking-tight uppercase max-w-2xl">
              PRECISION GRID SYSTEM UTILIZING HIGH-CONTRAST MONOCHROMATIC SURFACES AND MATHEMATICAL SPACING RATIOS.
            </p>
          </div>

          <div>
            <span className="font-mono-custom text-[10px] uppercase text-neutral-400 block mb-1">
              LABEL & MONO FONT — SPACE MONO (400/700)
            </span>
            <div className="font-mono-custom text-xs uppercase tracking-widest">
              MANIFEST_REF: 0892 // INK_COLOR: #000000 // CANVAS_COLOR: #FFFFFF
            </div>
          </div>
        </div>

        {/* Color Palette & Inversion Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border-[1.5px] ${borderClass} p-6 space-y-4`}>
            <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 block">
              02. Color Token Matrix
            </span>
            <div className="space-y-2 font-mono-custom text-xs">
              <div className="flex justify-between items-center p-2 border-[1.5px] border-current">
                <span>--bg</span>
                <span className="font-bold">{isDarkMode ? '#000000' : '#FFFFFF'}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-[1.5px] border-current">
                <span>--ink</span>
                <span className="font-bold">{isDarkMode ? '#FFFFFF' : '#000000'}</span>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-full py-3 border-[1.5px] ${borderClass} ${
                isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
              } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer mt-2`}
            >
              Invert Stark Theme Mode
            </button>
          </div>

          <div className={`border-[1.5px] ${borderClass} p-6 space-y-4`}>
            <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-neutral-500 block">
              03. Selection Test
            </span>
            <p className="font-mono-custom text-xs leading-relaxed select-all cursor-text p-3 border-[1.5px] border-dashed border-current">
              HIGHLIGHT THIS TEXT TO VERIFY HIGH-CONTRAST ::SELECTION BACKGROUND COLOR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
