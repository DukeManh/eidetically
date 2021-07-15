export default function Dropdown({ options }: { options: string[] }) {
  return (
    <div
      ref={(r) => {
        if (r) {
          r.onclick = (e) => {
            e.stopPropagation();
          };
        }
      }}
      className="menu-dropdown absolute z-50 bg-dropdown rounded-b-sm w-56 min-h"
      style={{ top: 'calc(100% + 1px)' }}
    >
      <div className="flex flex-col py-2">
        {options.map((option) => (
          <button key={option} className="w-full hover:bg-blue-500 text-left pl-4 mt-1">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
