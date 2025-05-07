import { useState } from 'react'
import { SearchIcon, DownloadIcon, ExternalLinkIcon, UsersIcon } from './EmojiIcons'

export default function UnfollowersList({ unfollowers, t }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pastikan unfollowers adalah array yang valid
  const validUnfollowers = Array.isArray(unfollowers) ? unfollowers : [];
  
  const handleExport = () => {
    if (!validUnfollowers.length) return;
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Username,Full Name\n" + 
      validUnfollowers.map(user => `"${user?.username || ''}","${typeof user?.full_name === 'string' ? user.full_name : String(user?.full_name || '')}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "instagram_unfollowers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Filter users based on search term - with better type checking and safety
  const filteredUsers = validUnfollowers.filter(user => {
    if (!user) return false;
    
    // Safely check username and full_name - ensure they're strings
    const username = String(user.username || '').toLowerCase();
    const fullName = String(user.full_name || '').toLowerCase();
    const searchTermLower = (searchTerm || '').toLowerCase();
    
    return searchTerm === '' || username.includes(searchTermLower) || fullName.includes(searchTermLower);
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="card-title flex items-center gap-2">
            <UsersIcon />
            {t.usersWhoDoNotFollowBack} ({validUnfollowers.length})
          </h2>
          
          <div className="flex gap-2 items-center">
            <div className="form-control">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder={t.searchUsers}
                  className="input input-bordered" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <SearchIcon />
                </button>
              </div>
            </div>
            
            <button 
              className="btn btn-outline" 
              onClick={handleExport}
              disabled={validUnfollowers.length === 0}
            >
              <DownloadIcon />
              {t.export}
            </button>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{t.profile}</th>
                  <th>{t.username}</th>
                  <th className="hidden md:table-cell">{t.fullName}</th>
                  <th>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          {user.profile_pic_url ? (
                            <img src={user.profile_pic_url} alt={user.username} />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 bg-neutral-focus text-neutral-content">
                              {user.username ? user.username[0].toUpperCase() : '?'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{user.username}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      {/* Tampilkan full_name dengan aman */}
                      {typeof user.full_name === 'number' && user.full_name > 1000000000
                        ? new Date(user.full_name * 1000).toLocaleDateString()
                        : String(user.full_name || '-')}
                    </td>
                    <td>
                      <a 
                        href={`https://instagram.com/${user.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        {t.viewProfile}
                        <ExternalLinkIcon />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg opacity-70">
                {searchTerm ? t.noUsersFound : t.noUnfollowersFound || "Everyone you follow is following you back!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}