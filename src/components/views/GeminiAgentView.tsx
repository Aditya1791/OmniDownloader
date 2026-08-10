import React, { useState } from 'react';

interface GeminiAgentViewProps {
  isDarkMode: boolean;
}

export const GeminiAgentView: React.FC<GeminiAgentViewProps> = ({ isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>(
    '// Gemini 2.5 Flash Code Assistant Output\n// Enter a prompt above to generate brutalist components or layout nodes...'
  );

  const borderClass = isDarkMode ? 'border-white' : 'border-black';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const userPrompt = prompt;

    setTimeout(() => {
      setGeneratedOutput(
        `// Gemini 2.5 Flash Generated Output for: "${userPrompt}"\n\n` +
          `export const StarkCard = ({ title, value }: { title: string; value: string }) => (\n` +
          `  <div className="border-[1.5px] border-black p-6 bg-white">\n` +
          `    <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">{title}</span>\n` +
          `    <h3 className="font-oswald text-5xl font-bold uppercase mt-2">{value}</h3>\n` +
          `  </div>\n` +
          `);`
      );
      setIsGenerating(false);
    }, 800);
  };

  const samplePrompts = [
    'Generate Stark Card Component',
    'Create Grid Navigation Node',
    'Build Monospace Metric Cell',
    'Design High Contrast Form Control',
  ];

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-neutral-500 font-bold">
            Manifest Layer: gemini_agent
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400">
            [SDK: @google/genai 2.4.0]
          </span>
        </div>

        <h1 className="font-oswald text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight uppercase -ml-1">
          Gemini
        </h1>

        <p className="font-sans font-light text-sm md:text-lg uppercase tracking-tight mt-2 max-w-xl">
          Automated AI Code Generation & UI Synthesis Engine
        </p>
      </div>

      <div className="my-6 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ASK GEMINI TO GENERATE UI COMPONENTS OR CODE..."
              className={`flex-1 p-3 border-[1.5px] ${borderClass} bg-transparent font-mono-custom text-xs sm:text-sm uppercase tracking-wider outline-none`}
            />
            <button
              type="submit"
              disabled={isGenerating}
              className={`px-8 py-3 border-[1.5px] ${
                isDarkMode ? 'bg-white text-black border-white hover:bg-neutral-200' : 'bg-black text-white border-black hover:bg-neutral-800'
              } font-sans font-bold text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50`}
            >
              {isGenerating ? 'GENERATING...' : 'GENERATE'}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 font-mono-custom text-xs">
          <span className="text-neutral-500 uppercase py-1">SUGGESTIONS:</span>
          {samplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className={`border-[1.5px] ${borderClass} px-3 py-1 uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer text-[11px]`}
            >
              + {p}
            </button>
          ))}
        </div>

        {/* Output Block */}
        <div className={`border-[1.5px] ${borderClass} p-6 font-mono-custom text-xs space-y-2 overflow-x-auto bg-transparent`}>
          <div className="flex justify-between items-center text-neutral-500 text-[10px] uppercase tracking-widest pb-2 border-b-[1.5px] border-current">
            <span>CODE OUTPUT PREVIEW</span>
            <span>TSX / REACT 19</span>
          </div>
          <pre className="p-2 text-xs leading-relaxed whitespace-pre-wrap">{generatedOutput}</pre>
        </div>
      </div>
    </div>
  );
};
