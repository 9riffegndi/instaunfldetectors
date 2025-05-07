import { useState } from 'react'

export default function UnfollowersList({ unfollowers, t }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Username,Full Name\n" + 
      unfollowers.map(user => `"${user.username || ''}","${user.full_name || ''}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "instagram_unfollowers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Filter users based on search term
  const filteredUsers = unfollowers.filter(user => {
    const usernameMatch = user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const fullNameMatch = user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    return usernameMatch || fullNameMatch
  })

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="card-title flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {t.usersWhoDoNotFollowBack} ({unfollowers.length})
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button className="btn btn-outline" onClick={handleExport}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {t.export}
            </button>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="table table-zebra">
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
                      {user.full_name || '-'}
                    </td>
                    <td>
                      <a 
                        href={`https://instagram.com/${user.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        {t.viewProfile}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg opacity-70">{t.noUsersFound}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}