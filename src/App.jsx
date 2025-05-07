import { useState, useEffect, useCallback } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import Stats from './components/Stats'
import UnfollowersList from './components/UnfollowersList'
import WelcomeModal from './components/WelcomeModal'
import { translations } from './translations'
import { InfoIcon, WarningIcon, QuestionMarkIcon } from './components/EmojiIcons'

// Tambahkan komponen debug
const DebugPanel = ({ followersData, followingData, unfollowers, stats, loading }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-2 right-2 p-4 bg-base-300 shadow-xl rounded-lg z-50 max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">🔍 Debug Panel</h3>
        <button className="btn btn-xs" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-base-200 p-2 rounded">
              <p className="font-semibold">Followers:</p>
              <p>{followersData ? followersData.length : 0}</p>
            </div>
            <div className="bg-base-200 p-2 rounded">
              <p className="font-semibold">Following:</p>
              <p>{followingData ? followingData.length : 0}</p>
            </div>
            <div className="bg-base-200 p-2 rounded">
              <p className="font-semibold">Unfollowers:</p>
              <p>{unfollowers ? unfollowers.length : 0}</p>
            </div>
            <div className="bg-base-200 p-2 rounded">
              <p className="font-semibold">Loading:</p>
              <p>{loading ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="font-semibold">Stats:</p>
            <pre className="text-xs bg-base-200 p-2 rounded overflow-auto max-h-24">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
          
          {followersData && followersData.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Follower Sample:</p>
              <pre className="text-xs bg-base-200 p-2 rounded overflow-auto max-h-24">
                {JSON.stringify(followersData[0], null, 2)}
              </pre>
            </div>
          )}
          
          {followingData && followingData.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Following Sample:</p>
              <pre className="text-xs bg-base-200 p-2 rounded overflow-auto max-h-24">
                {JSON.stringify(followingData[0], null, 2)}
              </pre>
            </div>
          )}
          
          <button 
            className="btn btn-sm btn-warning mt-2 w-full"
            onClick={() => {
              console.log({
                followersData,
                followingData,
                unfollowers,
                stats,
                loading
              });
              toast.success("Logged data to console");
            }}
          >
            Log to Console
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [unfollowers, setUnfollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
    return navigator.language.startsWith('id') ? 'id' : 'en';
  });
  
  const [stats, setStats] = useState({
    totalFollowers: 0,
    totalFollowing: 0,
    unfollowersCount: 0
  });
  
  // Get translations
  const t = translations[language];
  
  // Check if user has seen the tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial === 'true') {
      setShowWelcomeModal(false);
    }
  }, []);
  
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };
  
  const handleShowTutorialAgain = () => {
    setShowWelcomeModal(true);
  };
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Function to process data with detailed logging
  const processData = useCallback(() => {
    if (!followersData || !followingData) {
      toast.error(t.errorUploadBoth)
      return
    }

    setLoading(true)
    console.log("=========== PROCESSING DATA START ===========")

    // Use immediate processing to prevent race conditions
    try {
      console.log("Followers data:", followersData.length, "items")
      console.log("Following data:", followingData.length, "items")
      
      if (followersData.length > 0) {
        console.log("Follower sample:", JSON.stringify(followersData[0], null, 2))
      }
      
      if (followingData.length > 0) {
        console.log("Following sample:", JSON.stringify(followingData[0], null, 2))
      }

      // Create Sets for faster lookup
      let followers = new Set()
      let followingList = []
      
      // Extract usernames from followers with detailed logging
      console.log("Extracting followers usernames...")
      let followerFailCount = 0
      let followerSuccessCount = 0
      
      for (const follower of followersData) {
        let username = extractUsername(follower)
        if (username) {
          followers.add(username.toLowerCase())
          followerSuccessCount++
        } else {
          followerFailCount++
          if (followerFailCount < 5) {
            console.log("Failed to extract username from follower:", follower)
          }
        }
      }
      
      console.log(`Extracted ${followerSuccessCount} usernames, failed for ${followerFailCount} followers`)
      
      // Extract usernames and info from following
      console.log("Extracting following usernames...")
      let followingFailCount = 0
      let followingSuccessCount = 0
      
      for (const following of followingData) {
        let username = extractUsername(following)
        if (username) {
          followingList.push({
            username: username,
            full_name: extractFullName(following) || '',
            profile_pic_url: extractPicUrl(following) || ''
          })
          followingSuccessCount++
        } else {
          followingFailCount++
          if (followingFailCount < 5) {
            console.log("Failed to extract username from following:", following)
          }
        }
      }
      
      console.log(`Extracted ${followingSuccessCount} usernames, failed for ${followingFailCount} following`)
      
      // Find users who don't follow back
      console.log("Finding unfollowers...")
      const unfollowersList = followingList.filter(user => {
        if (!user.username) return false
        const isFollowing = followers.has(user.username.toLowerCase())
        return !isFollowing
      })
      
      console.log(`Found ${unfollowersList.length} unfollowers`)
      
      if (unfollowersList.length > 0) {
        console.log("Sample unfollower:", unfollowersList[0])
      }
      
      // Create fresh objects to ensure state update
      const newStats = {
        totalFollowers: followers.size,
        totalFollowing: followingList.length,
        unfollowersCount: unfollowersList.length
      }
      
      console.log("Setting new state:", {
        stats: newStats,
        unfollowers: unfollowersList.length
      })
      
      // Force a complete state reset to ensure React notices the change
      setStats(prevStats => ({...newStats}))
      setUnfollowers(prevUnfollowers => [...unfollowersList])
      
      // Show success message
      toast.success(t.successFoundUnfollowers.replace('{count}', unfollowersList.length))
      
      console.log("=========== PROCESSING DATA END ===========")
    } catch (error) {
      console.error("Error processing data:", error)
      toast.error(`${t.error}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [followersData, followingData, t])
  
  // Helper function to extract username from various formats
  const extractUsername = (item) => {
    if (!item) return null
    
    // Handling string_list_data format (common in Instagram exports)
    if (item.string_list_data && 
        Array.isArray(item.string_list_data) && 
        item.string_list_data[0] && 
        item.string_list_data[0].value) {
      return item.string_list_data[0].value
    }
    
    // Direct username property
    if (item.username) {
      return item.username
    }
    
    // Handle value property
    if (item.value) {
      return item.value
    }
    
    // Handle direct string
    if (typeof item === 'string') {
      return item
    }
    
    // Deep search for username-like fields in objects
    if (typeof item === 'object' && !Array.isArray(item)) {
      // Look for common username fields
      for (const key of ['username', 'user', 'name', 'login', 'handle']) {
        if (item[key] && typeof item[key] === 'string') {
          return item[key]
        }
      }
      
      // Look for any string field that looks like a username
      for (const key in item) {
        const val = item[key]
        if (typeof val === 'string' && 
            !val.includes(' ') && 
            val.length > 0 && 
            val.length < 50) {
          return val
        }
      }
    }
    
    return null
  }
  
  // Helper to extract full name with better timestamp handling
  const extractFullName = (item) => {
    if (!item) return null
    
    if (item.full_name) {
      // Return the full name if it's a string
      if (typeof item.full_name === 'string') {
        return item.full_name;
      }
      // If it's a timestamp, convert it to a readable date
      if (typeof item.full_name === 'number') {
        return `Last Active: ${new Date(item.full_name * 1000).toLocaleDateString()}`;
      }
    }
    
    // Handle Instagram's string_list_data format
    if (item.string_list_data && item.string_list_data[0]) {
      if (item.string_list_data[0].href) {
        return item.string_list_data[0].href.replace('https://www.instagram.com/', '');
      }
      if (item.string_list_data[0].timestamp) {
        const timestamp = item.string_list_data[0].timestamp;
        if (typeof timestamp === 'number') {
          return `Last Active: ${new Date(timestamp * 1000).toLocaleDateString()}`;
        }
        return String(timestamp);
      }
    }
    
    return null;
  }
  
  // Helper to extract profile pic URL
  const extractPicUrl = (item) => {
    if (!item) return null
    
    if (item.profile_pic_url) return item.profile_pic_url
    if (item.string_list_data && item.string_list_data[0] && item.string_list_data[0].profile_pic_url) {
      return item.string_list_data[0].profile_pic_url
    }
    
    return null
  }
  
  // Check if we have unfollowers to display
  const hasUnfollowers = unfollowers && unfollowers.length > 0
  
  // Debug effects
  useEffect(() => {
    console.log("State updated - unfollowers:", unfollowers.length)
  }, [unfollowers])
  
  useEffect(() => {
    console.log("State updated - stats:", stats)
  }, [stats])
  
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

      {/* Add the debug panel */}
      <DebugPanel 
        followersData={followersData}
        followingData={followingData}
        unfollowers={unfollowers}
        stats={stats}
        loading={loading}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {!hasUnfollowers && (
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
                  <QuestionMarkIcon />
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
          
          {/* Force render with key to ensure it updates when data changes */}
          {hasUnfollowers && (
            <div key={unfollowers.length}>
              <Stats stats={stats} t={t} />
              <UnfollowersList unfollowers={unfollowers} t={t} />
            </div>
          )}

          {!hasUnfollowers && !loading && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <InfoIcon />
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
                  <WarningIcon />
                  <div>
                    <h3 className="font-bold">{t.important}</h3>
                    <div className="text-sm">{t.dataPrivacyWarning}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Manual debug trigger */}
          <div className="flex justify-center">
            {loading && (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner text-primary"></span>
                <span>{t.processing}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}