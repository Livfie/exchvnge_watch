
import Image from 'next/image'
import Link from 'next/link';

export default function AppHeader() {

  return <header className="exchvnge_header"><Link href="/"><Image src="/exchvnge-logo-white.png" alt="Exchvnge" width="120" height="40" /></Link></header>
}