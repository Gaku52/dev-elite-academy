import { Module } from '@/types/learning';

interface MobileNavigationProps {
  modules: Module[];
  activeModule: number;
  activeSection: number;
  onChange: (moduleIndex: number, sectionIndex: number) => void;
}

export default function MobileNavigation({
  modules,
  activeModule,
  activeSection,
  onChange
}: MobileNavigationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [moduleIndex, sectionIndex] = e.target.value.split('-').map(Number);
    onChange(moduleIndex, sectionIndex);
  };

  return (
    <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
      <select
        value={`${activeModule}-${activeSection}`}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {modules.map((module, moduleIndex) => (
          <optgroup key={module.id} label={module.title}>
            {module.sections.map((section, sectionIndex) => (
              <option key={sectionIndex} value={`${moduleIndex}-${sectionIndex}`}>
                {section.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}