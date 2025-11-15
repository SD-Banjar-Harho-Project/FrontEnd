import Hero from '../components/Hero';
import Sambutan from '../components/Sambutan';
import Profil from '../components/Profil';
import InfoCards from '../components/InfoCards';
import BeritaAgenda from '../components/BeritaAgenda';
import Gallery from '../components/Gallery';

const Home = () => {
  return (
    <>
      <Hero />
      <Sambutan />
      <Profil />
      <InfoCards />
      <BeritaAgenda />
      <Gallery />
    </>
  );
};

export default Home;