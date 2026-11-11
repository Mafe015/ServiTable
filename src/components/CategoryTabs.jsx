const CategoryTabs = ({ categories, active, onChange }) => (
  <nav
    aria-label="Categorías del menú"
    className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible lg:w-64 lg:shrink-0 pb-2 lg:pb-0"
  >
    {categories.map((c) => (
      <button
        key={c}
        onClick={() => onChange(c)}
        aria-pressed={c === active}
        className={`min-h-[56px] px-6 rounded-full text-lg font-semibold whitespace-nowrap lg:text-left transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          c === active ? "bg-primary text-navy-900" : "glass text-ink"
        }`}
      >
        {c}
      </button>
    ))}
  </nav>
);

export default CategoryTabs;