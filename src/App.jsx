import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import UnfollowersList from './components/UnfollowersList'
import Stats from './components/Stats'
import WelcomeModal from './components/WelcomeModal'

export default function App() {
  const [followersData, setFollowersData] = useState(null)
  const [followingData, setFollowingData] = useState(null)
  const [unfollowers, setUnfollowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [stats, setStats] = useState({
    totalFollowers: 0,
    totalFollowing: 0,
    unfollowersCount: 0
  })

  // Check if this is the first visit to show the welcome modal
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

  const processData = () => {
    if (!followersData || !followingData) {
      toast.error("Please upload both followers and following data files first")
      return
    }

    setLoading(true)
    try {
      // Validate data structure
      if (!Array.isArray(followersData) || !Array.isArray(followingData)) {
        throw new Error("Invalid data format: Expected arrays for followers and following")
      }

      // Log data for debugging
      console.log("Processing data:")
      console.log("Followers data:", followersData.length, "items")
      console.log("Following data:", followingData.length, "items") 

      // Extract usernames
      let usernameField = 'username'
      
      // Check if username field exists, if not try to detect it
      if (followersData.length > 0 && !followersData[0].hasOwnProperty('username')) {
        // Try to find the username field by looking at common field names
        const possibleFields = ['username', 'string_list_data', 'value', 'name', 'user', 'login']
        
        for (const field of possibleFields) {
          if (followersData[0].hasOwnProperty(field)) {
            usernameField = field
            break
          } else if (followersData[0].string_list_data && 
                    followersData[0].string_list_data[0] && 
                    followersData[0].string_list_data[0].value) {
            // Special handling for Instagram's nested format
            usernameField = 'special_instagram_format'
            break
          }
        }
      }
      
      // Extract usernames based on the detected field format
      let followers
      let followingList
      
      if (usernameField === 'special_instagram_format') {
        // Handle Instagram's special nested format
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
        // Standard format
        followers = new Set(followersData.map(user => user[usernameField]))
        followingList = followingData
      }
      
      // Find users who don't follow back
      const unfollowersList = followingList.filter(user => {
        const username = usernameField === 'special_instagram_format' ? 
          user.username : user[usernameField]
        return !followers.has(username)
      })
      
      // Log results
      console.log(`Found ${unfollowersList.length} unfollowers`)
      
      // Update state with results
      setUnfollowers(unfollowersList)
      setStats({
        totalFollowers: followersData.length,
        totalFollowing: followingData.length,
        unfollowersCount: unfollowersList.length
      })
      
      toast.success(`Found ${unfollowersList.length} users who don't follow you back`)
    } catch (error) {
      console.error("Error processing data:", error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header onShowTutorial={handleShowTutorialAgain} />
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
      
      {/* Welcome modal that shows on first visit */}
      {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {!unfollowers.length > 0 && (
            <div className="text-center my-8">
              <h1 className="text-4xl font-bold mb-4">Instagram Unfollowers Checker</h1>
              <p className="text-xl opacity-75 max-w-2xl mx-auto">
                Find out who doesn't follow you back on Instagram by uploading your followers and following data
              </p>
              <div className="mt-4">
                <button 
                  onClick={handleShowTutorialAgain}
                  className="btn btn-outline btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  Show Tutorial
                </button>
              </div>
            </div>
          )}
          
          <FileUpload 
            setFollowersData={setFollowersData}
            setFollowingData={setFollowingData}
            processData={processData}
            isDataLoaded={!!(followersData && followingData)}
          />
          
          {unfollowers.length > 0 && (
            <>
              <Stats stats={stats} />
              <UnfollowersList unfollowers={unfollowers} />
            </>
          )}

          {!unfollowers.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  How to get your Instagram data
                </h2>
                
                <div className="divider"></div>
                
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Open Instagram on your mobile or web browser</li>
                  <li>Go to your profile and tap on the menu (three lines)</li>
                  <li>Select <span className="font-semibold">Settings and privacy</span></li>
                  <li>Tap on <span className="font-semibold">Accounts Center</span></li>
                  <li>Select <span className="font-semibold">Your information and permissions</span></li>
                  <li>Tap <span className="font-semibold">Download your information</span></li>
                  <li>Select <span className="font-semibold">Request a download</span></li>
                  <li>Choose JSON format and select <span className="font-semibold">Followers and following</span></li>
                  <li>Submit the request and wait for Instagram to prepare your data</li>
                  <li>Once ready, download and extract the zip file</li>
                  <li>You will need: <span className="badge badge-accent">followers_1.json</span> and <span className="badge badge-accent">following.json</span> files</li>
                </ol>
                
                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Important</h3>
                    <div className="text-sm">Your data remains on your device and is not uploaded to any server</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <footer className="footer footer-center p-4 text-base-content mt-16">
          <div>
            <p>Created with ❤️ using React, Tailwind CSS and DaisyUI</p>
          </div>
        </footer>
      </div>
    </div>
  )
}