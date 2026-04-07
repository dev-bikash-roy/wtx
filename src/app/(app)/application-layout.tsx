import Header from '@/components/Header/Header'
import Header2 from '@/components/Header/Header2'
import Banner from '@/shared/banner'
import GptAdSlot from '@/components/GptAdSlot'
import React, { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('@/components/Footer/Footer'))
const AsideSidebarNavigation = dynamic(() => import('@/components/aside-sidebar-navigation'))

interface Props {
  children: ReactNode
  headerHasBorder?: boolean
  headerStyle?: 'header-1' | 'header-2'
  showBanner?: boolean
}

const ApplicationLayout: React.FC<Props> = ({
  children,
  headerHasBorder,
  headerStyle = 'header-2',
  showBanner = false,
}) => {
  return (
    <>
      {/* GPT Ad Slot 1 - UK-Leaderboard above header on all pages */}
      <GptAdSlot slotId="div-gpt-ad-2784081-1" className="w-full" />

      {/* header - Chose header style here / header 1 or header 2*/}
      {showBanner && <Banner />}
      {headerStyle === 'header-2' && <Header2 bottomBorder={headerHasBorder} />}
      {headerStyle === 'header-1' && <Header bottomBorder={headerHasBorder} />}

      {children}

      {/* footer - Chose footer style here / footer 1 or footer 2 or footer 3 or footer 4 */}
      <Footer />
      {/* aside sidebar navigation */}
      <AsideSidebarNavigation />
    </>
  )
}

export { ApplicationLayout }
