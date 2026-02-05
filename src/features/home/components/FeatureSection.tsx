import { Skull, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Skull className="w-10 h-10 text-primary mb-2" />,
    title: "The Campaign",
    desc: "Set in the 1920s, uncover eldritch horrors and ancient mysteries that threaten the very fabric of reality across the globe."
  },
  {
    icon: <Users className="w-10 h-10 text-primary mb-2" />,
    title: "The Keeper",
    desc: "Guided by Caliel de Souza, weaving tales of suspense and cosmic horror in the classic Lovecraftian tradition."
  },
  {
    icon: <BookOpen className="w-10 h-10 text-primary mb-2" />,
    title: "Call of Cthulhu",
    desc: "A game of secrets, mysteries, and horror. Playing the role of steadfast investigators, you travel to strange and dangerous places."
  }
];

export function FeatureSection() {
  return (
    <section className="container mx-auto px-4 py-16 -mt-20 relative z-20">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <Card 
            key={i}
            className="group bg-card/95 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-3 bg-black/40 rounded-full border border-primary/10 group-hover:border-primary/30 transition-colors mb-4 inline-block">
                {feature.icon}
              </div>
              <CardTitle className="font-[MedievalSharp] text-2xl text-primary">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground font-serif leading-relaxed">
              {feature.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
