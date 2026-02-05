import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Images need to be imported relatively to this file
import fahImg from '../../../../assets/img/fah.jpeg';
import kassImg from '../../../../assets/img/tsu.jpeg';
import artImg from '../../../../assets/img/art.jpeg';
import leoImg from '../../../../assets/img/leo.jpeg';
import gabaoImg from '../../../../assets/img/gabao.jpeg';
import caliImg from '../../../../assets/img/caliel.jpg';

const players = [
  {
    name: "Caliel 'Cali' de Souza",
    image: caliImg,
    role: "The Keeper", // Destaque para o mestre
    description: "Mestre de RPG, banqueiro e reptiliano nas horas vagas.",
    isKeeper: true
  },
  {
    name: "Gabriel 'Gabão' Oliveira",
    image: gabaoImg,
    role: "Buff's Bff",
    description: "Ama gatos e tá sempre pronto para espalhar seu amor com os outros."
  },
  {
    name: "Leonardo 'Leo' de Paula",
    image: leoImg,
    role: "Entusiasta",
    description: "Apesar de nunca ter muito tempo, ama jogar RPG com os amigos e entra de cabeça."
  },
  {
    name: "Arthur 'Art' Barone",
    image: artImg,
    role: "Goblin",
    description: "Especialista em fazer cenas estilosas e divertidas."
  },
  {
    name: "Victor 'Fah' Favretto",
    image: fahImg,
    role: "Garoto de Programa",
    description: "Amante dos bons dialogos e pronto pra animar o time."
  },
  {
    name: "Kassio 'Kass' Gama",
    image: kassImg,
    role: "Radiante",
    description: "Lindo, inteligente e muito gente boa, um homem perfeito!"
  }
];

export function PlayersGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-10 justify-center">
        <User className="w-8 h-8 text-primary" />
        <h2 className="text-4xl font-bold font-[MedievalSharp] text-primary text-center">
          Dramatis Personae
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player, i) => (
          <Card 
            key={i} 
            className={`overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 group
              ${player.isKeeper ? 'bg-primary/5 border-primary/40' : 'bg-black/40'}`}
          >
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="w-full h-full object-cover object-[50%_20%] grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col items-center text-center -mt-6 relative z-20">
                <Badge variant={player.isKeeper ? "default" : "outline"} className="mb-3 border-primary/40">
                  {player.role}
                </Badge>
                
                <h3 className="text-xl font-[MedievalSharp] text-primary mb-2">
                  {player.name}
                </h3>
                
                <p className="text-muted-foreground font-serif text-sm italic">
                  "{player.description}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
