import {
  Skull,
  Users,
  BookOpen,
  Moon,
  Camera,
  Scroll,
  Eye,
  Flame,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import fahImg from "../../assets/img/fah.jpeg";
import kassImg from "../../assets/img/tsu.jpeg";
import artImg from "../../assets/img/art.jpeg";
import leoImg from "../../assets/img/leo.jpeg";
import gabaoImg from "../../assets/img/gabao.jpeg";
import caliImg from "../../assets/img/caliel.jpg";
import galleryImg1 from "../../assets/img/TelegrafoPeru.jpeg";
import galleryImg2 from "../../assets/img/TelegrafoJackson.jpeg";

const Home = () => {
  return (
    <div className="space-y-12 relative min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative text-center mb-12 py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-lg" />
        <Moon className="w-16 h-16 text-primary/90 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(181,57,35,0.7)]" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary font-heading animate-flicker text-shadow-glow">
          Máscaras de Nyarlathotep
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic leading-relaxed">
          "That is not dead which can eternal lie,
          <br />
          And with strange aeons even death may die."
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            <Eye className="w-3 h-3 mr-1" />
            Campanha Ativa
          </Badge>
          <Badge variant="outline" className="text-xs border-muted">
            1925 - Lima, Peru
          </Badge>
        </div>
      </section>

      {/* Players Section */}
      <Card className="bg-card/50 backdrop-blur border-border/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-heading text-primary">
              Os Jogadores
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Gabriel 'Gabão' Oliveira",
                image: gabaoImg,
                role: "Buff's Bff",
                description:
                  "Ama gatos e tá sempre pronto para espalhar seu amor com os outros.",
              },
              {
                name: "Leonardo 'Leo' de Paula",
                image: leoImg,
                role: "Entusiasta",
                description:
                  "Apesar de nunca ter muito tempo, ama jogar RPG com os amigos e entra de cabeça.",
              },
              {
                name: "Arthur 'Art' Barone",
                image: artImg,
                role: "Goblin",
                description:
                  "Especialista em fazer cenas estilosas e divertidas.",
              },
              {
                name: "Victor 'Fah' Favretto",
                image: fahImg,
                role: "Garoto de Programa",
                description:
                  "Amante dos bons diálogos e pronto pra animar o time.",
              },
              {
                name: "Kassio 'Kass' Gama",
                image: kassImg,
                role: "Radiante",
                description:
                  "Lindo, inteligente e muito gente boa, um homem perfeito!",
              },
              {
                name: "Caliel 'Cali' de Souza",
                image: caliImg,
                role: "O Guardião",
                description:
                  "Mestre de RPG, banqueiro e reptiliano nas horas vagas.",
              },
            ].map((player) => (
              <Card
                key={player.name}
                className="group hover:border-primary/40 transition-all duration-300 bg-background/50"
              >
                <CardHeader className="text-center pb-4">
                  <Avatar className="w-28 h-28 mx-auto mb-4 ring-2 ring-primary/20 group-hover:ring-primary transition-all duration-300">
                    <AvatarImage src={player.image} alt={player.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-heading">
                      {player.name.split(" ")[0][0]}
                      {player.name.split(" ")[1] ? player.name.split(" ")[1][1] : ""}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-heading text-primary">
                    {player.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground font-serif text-sm">
                    {player.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <Card className="bg-card/50 backdrop-blur border-border/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-heading text-primary">
              Galeria da Campanha
            </CardTitle>
          </div>
          <CardDescription>
            Documentos, telegramas e artefatos descobertos durante a investigação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[galleryImg1, galleryImg2].map((img, i) => (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <div className="group relative aspect-square rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer">
                    <img
                      src={img}
                      alt={`Item da galeria ${i + 1}`}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-primary/20 bg-black/95">
                  <img
                    src={img}
                    alt={`Item da galeria ${i + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest Updates */}
      <Card className="bg-card/50 backdrop-blur border-border/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-heading text-primary">
              Atualizações Recentes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "A carta de Jackson Elias",
                desc: "Após 4 anos dos primeiros eventos, todos investigadores receberam um telegrama misterioso de Jackson Elias.",
                date: "1925",
              },
              {
                title: "Primeira mesa finalizada!",
                desc: "Depois de quase 9 horas de muito combate e investigação, a primeira mesa foi concluída com sucesso.",
                date: "Sábado, 18 de Jan - 13:00",
              },
            ].map((update, index) => (
              <div
                key={index}
                className="group border-l-4 border-primary/40 pl-4 hover:border-primary transition-all duration-300 py-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-heading text-foreground group-hover:text-primary transition-colors">
                      {update.title}
                    </h3>
                    <p className="text-muted-foreground font-serif mt-1">
                      {update.desc}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
                    {update.date}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mythos Discoveries */}
      <Card className="bg-card/50 backdrop-blur border-border/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Scroll className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-heading text-primary">
              Descobertas dos Mitos
            </CardTitle>
          </div>
          <CardDescription>
            Artefatos, entidades e locais misteriosos encontrados pelos investigadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Tomos Ancestrais",
                items: [],
                icon: <BookOpen className="w-5 h-5" />,
              },
              {
                title: "Locais Misteriosos",
                items: ["Montanhas de Puno"],
                icon: <Eye className="w-5 h-5" />,
              },
              {
                title: "Entidades Encontradas",
                items: ["Nyarlathotep", "A Fome"],
                icon: <Skull className="w-5 h-5" />,
              },
              {
                title: "Artefatos Arcanos",
                items: [],
                icon: <Zap className="w-5 h-5" />,
              },
            ].map((category, i) => (
              <Card
                key={i}
                className="bg-background/50 border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-heading text-primary">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {category.items.length > 0 ? (
                    <ul className="space-y-2">
                      {category.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-muted-foreground font-serif italic flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                          <span className="group-hover:text-foreground transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground/50 font-serif italic text-sm">
                      Nenhuma descoberta registrada ainda...
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
