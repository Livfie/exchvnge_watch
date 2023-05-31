import '../globals.css'
import Image from 'next/image'

export default function AppFooter() {

  return <footer className="exchvnge_footer">
    Copyright &copy; {new Date().getFullYear()}. <p><a href="https://link.exchvnge.co/watchapp" target="_blank">
      <Image src="/appstore-logo.svg" alt="Download on iOS App Store" width="80" height="30"/>
      <Image src="/playstore-logo.png" alt="Download on Google Play Store" width="80"  height="30"/>
      </a>
    </p>

  </footer>

}