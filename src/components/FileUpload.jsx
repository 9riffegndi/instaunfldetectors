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
        let parsedData = null
        let result = event.target.result
        
        console.log(`Attempting to parse ${fileType} file:`, file.name)
        
        // SPECIAL HANDLING FOR FOLLOWING FILES
        if (fileType === 'following') {
          // Try a series of approaches specifically for following files
          
          // Approach 1: Direct parse (simplest case)
          try {
            parsedData = JSON.parse(result)
            console.log("Direct parse successful")
            
            // Handle common structure where actual data is in relationships_following
            if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
              if (parsedData.relationships_following) {
                parsedData = parsedData.relationships_following
                console.log("Extracted from relationships_following")
              }
            }
          } catch (e) {
            console.log("Direct parse failed, trying alternatives", e)
          }
          
          // Approach 2: Find arrays in the content
          if (!parsedData || !Array.isArray(parsedData)) {
            try {
              // Try to find the first large array in the JSON
              const arrayMatches = result.match(/\[\s*\{[^]*?\}\s*\]/g) || []
              
              if (arrayMatches.length > 0) {
                // Sort by length to get the largest array (likely the following list)
                arrayMatches.sort((a, b) => b.length - a.length)
                
                for (let i = 0; i < arrayMatches.length; i++) {
                  try {
                    const candidateData = JSON.parse(arrayMatches[i])
                    if (Array.isArray(candidateData) && candidateData.length > 0) {
                      parsedData = candidateData
                      console.log(`Found array with ${candidateData.length} items`)
                      break
                    }
                  } catch (err) {
                    console.log("Failed to parse array candidate", i)
                  }
                }
              }
            } catch (e) {
              console.log("Array extraction failed", e)
            }
          }
          
          // Approach 3: Search for specific string patterns
          if (!parsedData || !Array.isArray(parsedData)) {
            try {
              // Look for the string_list_data pattern
              const startIndex = result.indexOf('"string_list_data"')
              if (startIndex !== -1) {
                // Find the array that contains this pattern
                let bracketCount = 0
                let startBracketIndex = -1
                let endBracketIndex = -1
                
                // Go backwards to find the starting bracket
                for (let i = startIndex; i >= 0; i--) {
                  if (result[i] === '[') {
                    startBracketIndex = i
                    break
                  }
                }
                
                // Go forward to find matching end bracket
                if (startBracketIndex !== -1) {
                  for (let i = startBracketIndex + 1; i < result.length; i++) {
                    if (result[i] === '[') bracketCount++
                    if (result[i] === ']') {
                      if (bracketCount === 0) {
                        endBracketIndex = i
                        break
                      }
                      bracketCount--
                    }
                  }
                  
                  if (endBracketIndex !== -1) {
                    const arrayContent = result.substring(startBracketIndex, endBracketIndex + 1)
                    try {
                      const extractedArray = JSON.parse(arrayContent)
                      if (Array.isArray(extractedArray) && extractedArray.length > 0) {
                        parsedData = extractedArray
                        console.log(`Extracted array with ${extractedArray.length} items using bracket matching`)
                      }
                    } catch (e) {
                      console.log("Failed to parse extracted bracket content", e)
                    }
                  }
                }
              }
            } catch (e) {
              console.log("Pattern search failed", e)
            }
          }
          
          // If all else fails, try to extract any JSON structure
          if (!parsedData || !Array.isArray(parsedData)) {
            try {
              const jsonObjects = []
              let inString = false
              let escaped = false
              let buffer = ''
              let braceDepth = 0
              
              // Simple JSON object detector
              for (let i = 0; i < result.length; i++) {
                const char = result[i]
                
                if (char === '"' && !escaped) {
                  inString = !inString
                }
                
                if (!inString) {
                  if (char === '{') {
                    if (braceDepth === 0) {
                      buffer = '{'
                    } else {
                      buffer += '{'
                    }
                    braceDepth++
                  } else if (char === '}') {
                    braceDepth--
                    buffer += '}'
                    
                    if (braceDepth === 0) {
                      try {
                        const obj = JSON.parse(buffer)
                        jsonObjects.push(obj)
                      } catch (e) {
                        // Not a valid JSON object
                      }
                      buffer = ''
                    }
                  } else if (braceDepth > 0) {
                    buffer += char
                  }
                } else {
                  buffer += char
                }
                
                escaped = char === '\\' && !escaped
              }
              
              // Check if we found objects with username-like properties
              if (jsonObjects.length > 0) {
                const usernameObjects = jsonObjects.filter(obj => 
                  obj.username || 
                  (obj.string_list_data && obj.string_list_data[0] && obj.string_list_data[0].value)
                )
                
                if (usernameObjects.length > 0) {
                  parsedData = usernameObjects
                  console.log(`Created array from ${usernameObjects.length} extracted objects`)
                }
              }
            } catch (e) {
              console.log("JSON structure extraction failed", e)
            }
          }
        } else {
          // NORMAL HANDLING FOR FOLLOWERS FILE
          
          // Approach 1: Direct parse
          try {
            parsedData = JSON.parse(result)
            console.log("Direct parse successful")
          } catch (e) {
            console.log("Direct parse failed, trying array extraction", e)
            
            // Approach 2: Find JSON array in the content
            try {
              const jsonStart = result.indexOf('[')
              const jsonEnd = result.lastIndexOf(']')
              
              if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                const jsonContent = result.substring(jsonStart, jsonEnd + 1)
                parsedData = JSON.parse(jsonContent)
                console.log("Array extraction successful")
              }
            } catch (error) {
              console.log("Array extraction failed", error)
            }
          }
        }
        
        // If we still couldn't parse anything useful
        if (!parsedData) {
          throw new Error(t.errorFindJson || "Could not locate valid JSON content in the file")
        }
        
        // Normalize data if it's not an array yet
        if (!Array.isArray(parsedData)) {
          // If parsedData is an object with properties, check for arrays
          const arrayProps = Object.keys(parsedData).filter(key => 
            Array.isArray(parsedData[key]) && parsedData[key].length > 0
          )
          
          if (arrayProps.length > 0) {
            // Use the largest array property
            const largestArrayProp = arrayProps.reduce((a, b) => 
              parsedData[a].length > parsedData[b].length ? a : b
            )
            parsedData = parsedData[largestArrayProp]
            console.log(`Using array property: ${largestArrayProp} with ${parsedData.length} items`)
          } else {
            // Convert single object to array if needed
            parsedData = [parsedData]
            console.log("Converted single object to array")
          }
        }
        
        // Handle string_list_data format processing (common in Instagram exports)
        if (parsedData && Array.isArray(parsedData)) {
          // Check if we need to extract from string_list_data structure
          if (parsedData.length > 0 && 
              parsedData[0].string_list_data && 
              Array.isArray(parsedData[0].string_list_data)) {
            console.log("Detected string_list_data format, extracting...")
            parsedData = parsedData.map(item => {
              if (item.string_list_data && item.string_list_data[0]) {
                return {
                  username: item.string_list_data[0].value || '',
                  full_name: item.string_list_data[0].timestamp || '',
                  profile_pic_url: ''
                }
              }
              return null
            }).filter(Boolean)
            console.log("Converted data format:", parsedData[0])
          }
        }
        
        // Validate data is an array
        if (!Array.isArray(parsedData)) {
          throw new Error(t.errorNotArray || "File doesn't contain a valid array of users")
        }
        
        if (parsedData.length === 0) {
          throw new Error(t.errorEmptyArray || "The file contains an empty array")
        }
        
        // Debug validation
        console.log(`File ${fileType} contains:`, parsedData.length, "items")
        console.log("First item example:", parsedData[0])
        
        // Handle Instagram's specific format
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
        toast.error(`${fileType === 'followers' ? t.followersJson : t.followingJson}: ${error.message || t.errorInvalidFormat}`)
        
        // Reset file input
        if (fileType === 'followers') {
          document.getElementById('followers-upload').value = ''
          setFollowersFile(null)
        } else {
          document.getElementById('following-upload').value = ''
          setFollowingFile(null)
        }
      } finally {
        setLoading(false)
      }
    }
    
    reader.onerror = () => {
      toast.error(t.errorReadFile || "Failed to read file")
      setLoading(false)
      
      // Reset file state on error
      if (fileType === 'followers') {
        setFollowersFile(null)
      } else {
        setFollowingFile(null)
      }
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
                id="followers-upload"
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
                id="following-upload"
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