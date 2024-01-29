// import { CardGridLayout } from '@/components/CardGridLayout';
// import { FilterBar } from '@/components/FilterBar';
// import { StatusBar } from '@/components/StatusBar';
import { cookies } from 'next/headers';

const Home: React.FC = () => {
  const Cookies = cookies().getAll();
  return (
    <>
      <h1>{Cookies?.join(', ') || 'No hay cookies'}</h1>
      {/* <FilterBar />

      <div className="mt-[104px]">
        <StatusBar />
        <CardGridLayout />
      </div> */}
    </>
  );
};

export default Home;
