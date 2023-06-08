
import Image from 'next/image'

export default function AppFooter() {

  return <footer className="exchvnge_footer">
    <p><a href="https://link.exchvnge.co/watchapp" target="_blank">
      <Image src="/appstore.png" alt="Download on iOS App Store" width="120" height="40"/>&nbsp;
      <Image src="/playstore.png" alt="Download on Google Play Store" width="120"  height="40"/>
      </a>
    </p>
    <p> Copyright &copy; Exchvnge by Livfie Inc {new Date().getFullYear()}.</p>

  </footer>

}