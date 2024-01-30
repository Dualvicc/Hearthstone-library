// import { CardGridLayout } from '@/components/CardGridLayout';
// import { FilterBar } from '@/components/FilterBar';
// import { StatusBar } from '@/components/StatusBar';
import { cookies } from 'next/headers';

const Home: React.FC = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token');
  return (
    <>
      <h1>{token?.name && token?.value ? `${token.name} : ${token.value}` : 'no hay token'}</h1>
      {/* <FilterBar />

      <div className="mt-[104px]">
        <StatusBar />
        <CardGridLayout />
      </div> */}
    </>
  );
};

export default Home;
