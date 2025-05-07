import { useState } from 'react'

export default function UnfollowersList({ unfollowers }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Function to get username from user object regardless of format
  const getUsername = (user) => {
    if (user.username) return user.username
    if (user.string_list_data && user.string_list_data[0]?.value) return user.string_list_data[0].value
    return Object.values(user)[0] || 'Unknown'
  }
  
  // Function to get full name from user object
  const getFullName = (user) => {
    if (user.full_name) return user.full_name
    if (user.string_list_data && user.string_list_data[0]?.href) return user.string_list_data[0].href
    return '-'
  }
  
  // Function to get profile pic URL
  const getProfilePic = (user) => {
    return user.profile_pic_url || ''
  }

  // Filter unfollowers based on search query
  const filteredUnfollowers = unfollowers.filter(user => {
    const username = getUsername(user).toLowerCase()
    const fullName = getFullName(user).toLowerCase()
    const query = searchQuery.toLowerCase()
    return username.includes(query) || fullName.includes(query)
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredUnfollowers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUnfollowers.slice(indexOfFirstItem, indexOfLastItem)

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  // Download as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = ['Username', 'Full Name']
    let csvContent = headers.join(',') + '\n'
    
    filteredUnfollowers.forEach(user => {
      const row = [
        `"${getUsername(user)}"`, 
        `"${getFullName(user).replace(/"/g, '""')}"`
      ]
      csvContent += row.join(',') + '\n'
    })
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'instagram_unfollowers.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="card-title m-0 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-error">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
            Users Who Don't Follow You Back
            <div className="badge badge-error badge-lg">{filteredUnfollowers.length}</div>
          </h2>
          
          <div className="flex gap-2">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-bordered"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-square">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button onClick={downloadCSV} className="btn btn-outline btn-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
          </div>
        </div>
        
        <div className="divider"></div>
        
        {filteredUnfollowers.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No users found matching your search criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th className="hidden md:table-cell">Full Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => {
                  const username = getUsername(user)
                  const fullName = getFullName(user)
                  const profilePic = getProfilePic(user)
                  
                  return (
                    <tr key={index} className="hover">
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-base-300">
                            {profilePic ? (
                              <img 
                                src={profilePic} 
                                alt={username} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/40?text=IG';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">{username}</td>
                      <td className="hidden md:table-cell">{fullName}</td>
                      <td>
                        <a 
                          href={`https://instagram.com/${username}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                        >
                          View Profile
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="join">
              <button 
                className="join-item btn" 
                onClick={() => goToPage(1)} 
                disabled={currentPage === 1}
              >
                «
              </button>
              <button 
                className="join-item btn" 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show current page, first, last, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) ||
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <button key={i} className="join-item btn btn-disabled">...</button>;
                }
                return null;
              })}
              
              <button 
                className="join-item btn" 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button 
                className="join-item btn" 
                onClick={() => goToPage(totalPages)} 
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}