import Image from 'next/image'
import Header from '@/components/Header'
import Filter from '@/components/Filter'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <>
      <Header />
      <Filter/>
      <Gallery />
    </>

  )
}
