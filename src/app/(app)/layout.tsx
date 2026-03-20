import { AudioProvider } from '@/components/AudioProvider'
import Aside from '@/components/aside'
import { AudioPlayer } from '@/components/audio-player/AudioPlayer'
import { AuthProvider } from '@/contexts/AuthContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AudioProvider>
        <Aside.Provider>{children}</Aside.Provider>
        <div className="fixed inset-x-0 bottom-0 z-20">
          <AudioPlayer />
        </div>
      </AudioProvider>
    </AuthProvider>
  )
}

export default Layout
