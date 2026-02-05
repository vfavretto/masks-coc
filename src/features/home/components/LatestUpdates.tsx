import { Scroll } from 'lucide-react';

const updates = [
  {
    title: "A carta de Jackson Elias",
    date: "Jan 2024",
    desc: "Após 4 anos dos primeiros eventos, todos investigadores receberam um telegrafo misterioso de Jackson Elias convocado-os para uma reunião urgente."
  },
  {
    title: "Primeira mesa finalizada!",
    date: "Saturday, Jan 18th - 1:00 PM",
    desc: "Depois de quase 9 horas de muito combate e investigação, a primeira mesa foi concluida com sucesso. Os investigadores sobreviveram... por enquanto."
  }
];

export function LatestUpdates() {
  return (
    <section className="container mx-auto px-4 py-16 bg-primary/5 rounded-3xl my-16 border border-primary/10">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-4xl font-bold font-[MedievalSharp] text-primary mb-6 flex items-center gap-3">
              <Scroll className="w-8 h-8" />
              Latest Chronicles
            </h2>
            <p className="text-muted-foreground font-serif text-lg italic">
              Acompanhe o desenrolar dos eventos e as descobertas perturbadoras de nossos investigadores.
            </p>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-8">
          {updates.map((update, i) => (
            <div key={i} className="relative pl-8 border-l-2 border-primary/20 hover:border-primary/50 transition-colors pb-8 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-background border-2 border-primary rounded-full" />
              
              <span className="text-sm font-bold text-primary/60 uppercase tracking-widest mb-2 block">
                {update.date}
              </span>
              
              <h3 className="text-2xl font-bold font-[MedievalSharp] text-foreground mb-3">
                {update.title}
              </h3>
              
              <p className="text-muted-foreground font-serif leading-relaxed">
                {update.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
