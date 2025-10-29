import {
  Skull,
  Users,
  BookOpen,
  Moon,
  Camera,
  Scroll,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import fahImg from "../../assets/img/fah.jpeg";
import kassImg from "../../assets/img/tsu.jpeg";
import artImg from "../../assets/img/art.jpeg";
import leoImg from "../../assets/img/leo.jpeg";
import gabaoImg from "../../assets/img/gabao.jpeg";
import caliImg from "../../assets/img/caliel.jpg";
import galleryImg1 from "../../assets/img/TelegrafoPeru.jpeg";
import galleryImg2 from "../../assets/img/TelegrafoJackson.jpeg";

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const textElements = document.querySelectorAll(".flicker");
    const intervals: NodeJS.Timeout[] = [];
    
    textElements.forEach((element) => {
      const interval = setInterval(() => {
        if (element instanceof HTMLElement) {
          element.style.opacity = Math.random() < 0.97 ? "1" : "0";
        }
      }, 2000);
      intervals.push(interval);
    });

    // Cleanup intervals when component unmounts
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <div className="space-y-12 relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 pointer-events-none" />

      <section className="relative text-center mb-12 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />
        <Moon className="w-16 h-16 text-primary/80 mx-auto mb-6 animate-pulse" />
        <h1 className="text-6xl font-bold mb-6 text-primary font-[MedievalSharp] flicker">
          Masks of Nyarlathotep
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-serif italic">
          "That is not dead which can eternal lie,
          <br />
          And with strange aeons even death may die."
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <Skull className="w-12 h-12 text-primary mb-4" />,
            title: "About the Campaign",
            desc: "Set in 1920s, our investigators uncover eldritch horrors and ancient mysteries that threaten the very fabric of reality.",
          },
          {
            icon: <Users className="w-12 h-12 text-primary mb-4" />,
            title: "Meet the Keeper",
            desc: "Led by our experienced Keeper, Caliel de Souza, who has been running Lovecraftian horror campaigns for many years.",
          },
          {
            icon: <BookOpen className="w-12 h-12 text-primary mb-4" />,
            title: "New to Call of Cthulhu?",
            desc: "Learn about the game system, character creation, and the unique elements that make Call of Cthulhu special.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
          >
            {item.icon}
            <h2 className="text-2xl font-bold mb-2 font-[MedievalSharp]">
              {item.title}
            </h2>
            <p className="text-gray-400 font-serif">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="card mt-12">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-primary" />
          <h2 className="heading mb-0 font-[MedievalSharp]">Players</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                "Amante dos bons dialogos e pronto pra animar o time.",
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
              role: "O Mestre",
              description:
                "Mestre de RPG, banqueiro e reptiliano nas horas vagas.",
            },
          ].map((player) => (
            <div
              key={player.name}
              className="flex flex-col items-center p-6 bg-black/30 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-32 h-32 rounded-full border-2 border-primary/20 object-cover mb-4 hover:border-primary transition-all duration-300"
              />
              <div className="text-center">
                <h3 className="text-2xl font-[MedievalSharp] text-primary">
                  {player.name}
                </h3>
                <div className="text-sm text-gray-400 mb-2 font-serif">
                  {player.role}
                </div>
                <p className="text-gray-300 font-serif">{player.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="w-8 h-8 text-primary" />
          <h2 className="heading mb-0 font-[MedievalSharp]">
            Campaign Gallery
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[galleryImg1, galleryImg2].map((img, i) => (
            <div
              key={i}
              className="aspect-square bg-black/50 rounded-lg border border-primary/20 overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Gallery item ${i}`}
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </section>

      <section className="card mt-12 bg-gray-900/80">
        <h2 className="heading font-[MedievalSharp]">Latest Updates</h2>
        <div className="space-y-4">
          {[
            {
              title: "A carta de Jackson Elias",
              desc: "Após 4 anos dos primeiros eventos, todos investigadores receberam um telegrafo misterioso de Jackson Elias.",
            },
            {
              title: "Primeira mesa finalizada!",
              desc: "Depois de quase 9 horas de muito combate e investigação, a primeira mesa foi concluida com sucesso.",
              date: "Saturday, Jan 18th - 1:00 PM",
            },
          ].map((update, index) => (
            <div
              key={index}
              className="border-l-4 border-primary pl-4 hover:border-primary/80 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold font-[MedievalSharp]">
                {update.title}
              </h3>
              <p className="text-gray-400 font-serif">
                {update.date || update.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Scroll className="w-8 h-8 text-primary" />
          <h2 className="heading mb-0 font-[MedievalSharp]">
            Mythos Discoveries
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
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
          ].map((category, i) => (
            <div
              key={i}
              className="border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors duration-300"
            >
              <h3 className="text-xl font-[MedievalSharp] text-primary mb-3">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-gray-400 font-serif italic flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
