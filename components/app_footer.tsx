
import Image from 'next/image'

export default function AppFooter() {

  return <footer className="exchvnge_footer">
    <p><a href="https://link.exchvnge.co/watchapp" target="_blank">
      <Image src="/appstore-logo.svg" alt="Download on iOS App Store" width="80" height="30"/>
      <Image src="/playstore-logo.png" alt="Download on Google Play Store" width="80"  height="30"/>
      </a>
    </p>
    <p> Copyright &copy; Exchvnge by Livfie Inc {new Date().getFullYear()}.</p>

  </footer>

}