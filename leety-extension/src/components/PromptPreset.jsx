const presets = [
  {
    id: 1,
    label: "Explain my Code",
    prompt: "Explain my solution step by step. Do not give an alternative solution."
  },
  {
    id: 2,
    label: "Find Bugs",
    prompt: "Find logical errors and edge cases in my solution."
  },
  {
    id: 3,
    label: "Optimize",
    prompt: "Suggest a more optimal approach and explain why it is better."
  }
];

export default function PromptPresets({ onSelect, floating = false }) {
  return (
    <div
      className={
        floating
          ? "fixed bottom-20 right-4 z-50 flex flex-col gap-2"
          : "flex flex-col gap-2"
      }
    >
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.prompt)}
          className="
            bg-slate-800 hover:bg-slate-700
            px-4 py-2 rounded-xl
            text-sm text-left
            shadow-lg
            transition-colors
          "
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}