import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import UnfollowersList from './components/UnfollowersList'
import Stats from './components/Stats'
import WelcomeModal from './components/WelcomeModal'
import { translations } from './translations'

export default function App() {
  const [followersData, setFollowersData] = useState(null)
  const [followingData, setFollowingData] = useState(null)
  const [unfollowers, setUnfollowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) return savedLanguage

    const browserLanguage = navigator.language.split('-')[0]
    return browserLanguage === 'id' ? 'id' : 'en'
  })
  const [stats, setStats] = useState({
    totalFollowers: 0,
    totalFollowing: 0,
    unfollowersCount: 0
  })

  const t = translations[language]

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setShowWelcomeModal(true)
    }
  }, [])

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
    localStorage.setItem('hasSeenTutorial', 'true')
  }

  const handleShowTutorialAgain = () => {
    setShowWelcomeModal(true)
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const processData = () => {
    if (!followersData || !followingData) {
      toast.error(t.errorUploadBoth)
      return
    }

    setLoading(true)
    try {
      if (!Array.isArray(followersData) || !Array.isArray(followingData)) {
        throw new Error(t.errorInvalidFormat)
      }

      console.log("Processing data:")
      console.log("Followers data:", followersData.length, "items")
      console.log("Following data:", followingData.length, "items")

      let usernameField = 'username'

      if (followersData.length > 0 && !followersData[0].hasOwnProperty('username')) {
        const possibleFields = ['username', 'string_list_data', 'value', 'name', 'user', 'login']

        for (const field of possibleFields) {
          if (followersData[0].hasOwnProperty(field)) {
            usernameField = field
            break
          } else if (followersData[0].string_list_data &&
            followersData[0].string_list_data[0] &&
            followersData[0].string_list_data[0].value) {
            usernameField = 'special_instagram_format'
            break
          }
        }
      }

      let followers
      let followingList

      if (usernameField === 'special_instagram_format') {
        followers = new Set(
          followersData
            .filter(item => item.string_list_data && item.string_list_data[0])
            .map(item => item.string_list_data[0].value)
        )

        followingList = followingData
          .filter(item => item.string_list_data && item.string_list_data[0])
          .map(item => ({
            username: item.string_list_data[0].value,
            full_name: item.string_list_data[0].href || '',
            profile_pic_url: ''
          }))
      } else {
        followers = new Set(followersData.map(user => user[usernameField]))
        followingList = followingData
      }

      const unfollowersList = followingList.filter(user => {
        const username = usernameField === 'special_instagram_format' ?
          user.username : user[usernameField]
        return !followers.has(username)
      })

      console.log(`Found ${unfollowersList.length} unfollowers`)

      setUnfollowers(unfollowersList)
      setStats({
        totalFollowers: followersData.length,
        totalFollowing: followingData.length,
        unfollowersCount: unfollowersList.length
      })

      toast.success(t.successFoundUnfollowers.replace('{count}', unfollowersList.length))
    } catch (error) {
      console.error("Error processing data:", error)
      toast.error(`${t.error}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header
        onShowTutorial={handleShowTutorialAgain}
        language={language}
        changeLanguage={changeLanguage}
        t={t}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--base-100)',
            color: 'var(--base-content)',
          },
        }}
      />

      {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} t={t} />}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {!unfollowers.length > 0 && (
            <div className="text-center my-8">
              <h1 className="text-4xl font-bold mb-4">{t.appTitle}</h1>
              <p className="text-xl opacity-75 max-w-2xl mx-auto">
                {t.tagline}
              </p>
              <div className="mt-4">
                <button
                  onClick={handleShowTutorialAgain}
                  className="btn btn-outline btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  {t.showTutorial}
                </button>
              </div>
            </div>
          )}

          <FileUpload
            setFollowersData={setFollowersData}
            setFollowingData={setFollowingData}
            processData={processData}
            isDataLoaded={!!(followersData && followingData)}
            t={t}
          />

          {unfollowers.length > 0 && (
            <>
              <Stats stats={stats} t={t} />
              <UnfollowersList unfollowers={unfollowers} t={t} />
            </>
          )}

          {!unfollowers.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  {t.howToGetData}
                </h2>

                <div className="divider"></div>

                <ol className="list-decimal list-inside space-y-2 mt-2">
                  {t.howToInstructions.map((instruction, index) => (
                    <li key={index}>
                      {instruction.includes('<span') ? (
                        <div dangerouslySetInnerHTML={{ __html: instruction }} />
                      ) : instruction}
                    </li>
                  ))}
                </ol>

                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">{t.important}</h3>
                    <div className="text-sm">{t.dataPrivacyWarning}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}