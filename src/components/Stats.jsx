import { ChartBarIcon, TextIcons } from './EmojiIcons'

export default function Stats({ stats, t }) {
  // Ensure stats is a valid object
  const validStats = stats || {
    totalFollowers: 0,
    totalFollowing: 0,
    unfollowersCount: 0
  };
  
  const unfollowPercentage = validStats.totalFollowing > 0 
    ? Math.round((validStats.unfollowersCount / validStats.totalFollowing) * 100) 
    : 0;
    
  const followBackCount = validStats.totalFollowing - validStats.unfollowersCount;
  const followBackPercentage = validStats.totalFollowing > 0
    ? Math.round((followBackCount / validStats.totalFollowing) * 100)
    : 0;

  // Tidak perlu lagi handle SVG error karena kita menggunakan emoji
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2 mb-4">
          <ChartBarIcon />
          {t.accountStatistics}
        </h2>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats bg-primary text-primary-content shadow">
            <div className="stat">
              <div className="stat-title">{t.followers}</div>
              <div className="stat-value">{validStats.totalFollowers.toLocaleString()}</div>
              <div className="stat-desc">{t.peopleFollowingYou}</div>
            </div>
          </div>
          
          <div className="stats bg-accent text-accent-content shadow">
            <div className="stat">
              <div className="stat-title">{t.following}</div>
              <div className="stat-value">{validStats.totalFollowing.toLocaleString()}</div>
              <div className="stat-desc">{t.peopleYouFollow}</div>
            </div>
          </div>
          
          <div className="stats bg-secondary text-secondary-content shadow">
            <div className="stat">
              <div className="stat-title">{t.dontFollowBack}</div>
              <div className="stat-value">{validStats.unfollowersCount.toLocaleString()}</div>
              <div className="stat-desc">{unfollowPercentage}% {t.ofYourFollowing}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">{t.followBackRatio}</h3>
            <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700 overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-success h-full text-xs font-medium text-success-content text-center p-0.5 leading-none"
                  style={{ width: `${followBackPercentage}%` }}
                >
                  {followBackPercentage >= 15 && `${followBackPercentage}%`}
                </div>
                <div 
                  className="bg-error h-full text-xs font-medium text-error-content text-center p-0.5 leading-none"
                  style={{ width: `${unfollowPercentage}%` }}
                >
                  {unfollowPercentage >= 15 && `${unfollowPercentage}%`}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm mt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                <span>{t.usersFollowYouBack?.replace('{count}', followBackCount.toLocaleString()) || 
                      `${followBackCount.toLocaleString()} users follow you back`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-error rounded-full"></span>
                <span>{t.usersDontFollowYouBack?.replace('{count}', validStats.unfollowersCount.toLocaleString()) || 
                      `${validStats.unfollowersCount.toLocaleString()} users don't follow you back`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}