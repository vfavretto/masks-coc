import { Scroll } from 'lucide-react';

const discoveries = [
  {
    title: "Ancient Tomes",
    items: [],
  },
  {
    title: "Mysterious Locations",
    items: ["Montanhas de Puno"],
  },
  {
    title: "Encountered Entities",
    items: ["Nyarlathotep", "A Fome"],
  },
  {
    title: "Arcane Artifacts",
    items: [],
  },
];

export function MythosDiscoveries() {
  return (
    <section className="container mx-auto px-4 py-16 mb-20">
      <div className="flex items-center gap-3 mb-10 justify-center">
        <Scroll className="w-8 h-8 text-primary" />
        <h2 className="text-4xl font-bold font-[MedievalSharp] text-primary text-center">
          Mythos Discoveries
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {discoveries.map((category, i) => (
          <div
            key={i}
            className="bg-black/40 border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-colors duration-300 flex flex-col h-full"
          >
            <h3 className="text-xl font-[MedievalSharp] text-primary mb-4 pb-2 border-b border-primary/10 text-center">
              {category.title}
            </h3>
            
            {category.items.length > 0 ? (
              <ul className="space-y-3 flex-1">
                {category.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground font-serif italic flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground/30 font-serif italic text-sm">
                No records yet...
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
