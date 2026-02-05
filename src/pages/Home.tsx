import { useEffect } from 'react';
import { 
  HeroSection, 
  FeatureSection, 
  PlayersGrid, 
  LatestUpdates, 
  CampaignGallery, 
  MythosDiscoveries 
} from '@/features/home';

const Home = () => {
  useEffect(() => {
    // Flicker effect
    const textElements = document.querySelectorAll(".flicker");
    const intervals: NodeJS.Timeout[] = [];
    
    textElements.forEach((element) => {
      const interval = setInterval(() => {
        if (element instanceof HTMLElement) {
          element.style.opacity = Math.random() < 0.97 ? "1" : "0.5";
        }
      }, 2000);
      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-background">
      <HeroSection />
      <FeatureSection />
      <LatestUpdates />
      <PlayersGrid />
      <MythosDiscoveries />
      <CampaignGallery />
    </div>
  );
};

export default Home;
