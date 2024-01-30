// import { CardGridLayout } from '@/components/CardGridLayout';
// import { FilterBar } from '@/components/FilterBar';
// import { StatusBar } from '@/components/StatusBar';
import { cookies } from 'next/headers';

const cookieStore = cookies();
const Home: React.FC = () => {
  return (
    <>
      <h1>buenos dias</h1>
      <h2>{cookieStore.toString() || 'No hay cookies'}</h2>
      {/* <FilterBar />

      <div className="mt-[104px]">
        <StatusBar />
        <CardGridLayout />
      </div> */}
    </>
  );
};

export default Home;
