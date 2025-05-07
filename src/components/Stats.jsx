export default function Stats({ stats }) {
  const unfollowPercentage = stats.totalFollowing > 0 
    ? Math.round((stats.unfollowersCount / stats.totalFollowing) * 100) 
    : 0

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          Account Statistics
        </h2>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stats bg-primary text-primary-content shadow">
            <div className="stat">
              <div className="stat-figure text-primary-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 010 7.75"></path>
                </svg>
              </div>
              <div className="stat-title">Followers</div>
              <div className="stat-value">{stats.totalFollowers}</div>
              <div className="stat-desc">People following you</div>
            </div>
          </div>
          
          <div className="stats bg-accent text-accent-content shadow">
            <div className="stat">
              <div className="stat-figure text-accent-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Following</div>
              <div className="stat-value">{stats.totalFollowing}</div>
              <div className="stat-desc">People you follow</div>
            </div>
          </div>
          
          <div className="stats bg-secondary text-secondary-content shadow">
            <div className="stat">
              <div className="stat-figure text-secondary-content">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </div>
              <div className="stat-title">Don't Follow Back</div>
              <div className="stat-value">{stats.unfollowersCount}</div>
              <div className="stat-desc">{unfollowPercentage}% of your following</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-1">Follow-back ratio</div>
          <progress 
            className="progress progress-primary w-full" 
            value={stats.totalFollowing - stats.unfollowersCount} 
            max={stats.totalFollowing}
          ></progress>
          <div className="flex justify-between text-xs mt-1 text-base-content/70">
            <span>{stats.totalFollowing - stats.unfollowersCount} users follow you back</span>
            <span>{stats.unfollowersCount} users don't follow you back</span>
          </div>
        </div>
      </div>
    </div>
  )
}