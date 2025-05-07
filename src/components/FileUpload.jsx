import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function FileUpload({ setFollowersData, setFollowingData, processData, isDataLoaded, t }) {
  const [followersFile, setFollowersFile] = useState(null)
  const [followingFile, setFollowingFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0]
    if (!file) return
    
    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        // First try to parse directly
        let parsedData = null
        let result = event.target.result
        
        try {
          parsedData = JSON.parse(result)
        } catch (e) {
          console.log("Initial parsing failed, trying to find JSON content")
          
          // Try to find JSON array in the content
          const jsonStart = result.indexOf('[')
          const jsonEnd = result.lastIndexOf(']')
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            const jsonContent = result.substring(jsonStart, jsonEnd + 1)
            try {
              parsedData = JSON.parse(jsonContent)
            } catch (innerError) {
              console.error("Failed to parse extracted content", innerError)
              throw new Error("Could not parse JSON content from file")
            }
          } else {
            throw new Error("Could not locate valid JSON content in the file")
          }
        }
        
        // Validate data is an array
        if (!Array.isArray(parsedData)) {
          throw new Error("File doesn't contain a valid array of users")
        }
        
        // Debug validation
        console.log(`File ${fileType} contains:`, parsedData.length, "items")
        console.log("First item example:", parsedData[0])
        
        if (fileType === 'followers') {
          setFollowersFile(file.name)
          setFollowersData(parsedData)
          toast.success(`${t.followers}: ${parsedData.length}`)
        } else {
          setFollowingFile(file.name)
          setFollowingData(parsedData)
          toast.success(`${t.following}: ${parsedData.length}`)
        }
      } catch (error) {
        console.error("Error processing file:", error)
        toast.error(`${t.error}: ${error.message || "Invalid file format"}`)
      } finally {
        setLoading(false)
      }
    }
    
    reader.onerror = () => {
      toast.error("Failed to read file")
      setLoading(false)
    }
    
    reader.readAsText(file)
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          {t.uploadTitle}
        </h2>
        
        <div className="divider"></div>
        
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{t.uploadInstructions}</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t.followersJson}</span>
            </label>
            <div className="relative w-full">
              <input 
                type="file" 
                className="file-input file-input-bordered file-input-primary w-full" 
                accept=".json,application/json,text/plain"
                onChange={(e) => handleFileUpload(e, 'followers')}
              />
              {followersFile && (
                <div className="mt-2 flex items-center gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-sm">{followersFile}</span>
                </div>
              )}
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content/70">{t.peopleWhoFollowYou}</span>
            </label>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t.followingJson}</span>
            </label>
            <div className="relative w-full">
              <input 
                type="file" 
                className="file-input file-input-bordered file-input-primary w-full" 
                accept=".json,application/json,text/plain"
                onChange={(e) => handleFileUpload(e, 'following')}
              />
              {followingFile && (
                <div className="mt-2 flex items-center gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-sm">{followingFile}</span>
                </div>
              )}
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content/70">{t.peopleYouFollow}</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-sm text-base-content/70">
              {followersFile && followingFile ? 
                <span className="text-success flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {t.bothFilesLoaded}
                </span> : 
                <span className="text-warning">
                  {!followersFile && !followingFile ? 
                    t.pleaseUploadFiles : 
                    t.stillNeedToUpload.replace('{fileType}', !followersFile ? t.followers.toLowerCase() : t.following.toLowerCase())}
                </span>
              }
            </div>
            
            <button 
              className={`btn btn-primary ${loading ? 'loading' : ''}`} 
              onClick={processData}
              disabled={!followersFile || !followingFile || loading}
            >
              {loading ? t.processing : t.findUnfollowers}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}