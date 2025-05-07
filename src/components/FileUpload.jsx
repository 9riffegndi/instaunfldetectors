import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function FileUpload({ setFollowersData, setFollowingData, processData, isDataLoaded }) {
  const [followersFile, setFollowersFile] = useState(null)
  const [followingFile, setFollowingFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Function to recursively search for arrays in a JSON object
  const findArraysInObject = (obj) => {
    // If it's already an array with length > 0, return it
    if (Array.isArray(obj) && obj.length > 0) {
      return obj;
    }
    
    // If it's an object, search through its properties
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        const result = findArraysInObject(obj[key]);
        if (result) return result;
      }
    }
    
    return null;
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0]
    if (!file) return
    
    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const rawContent = event.target.result;
        console.log(`Raw ${fileType} file content (first 200 chars):`, rawContent.substring(0, 200));
        
        // Try multiple parsing approaches
        let parsedData;
        
        // First, try direct parsing
        try {
          parsedData = JSON.parse(rawContent);
        } catch (e) {
          console.log("Direct parsing failed:", e);
          
          // Try to extract JSON by looking for array patterns
          try {
            const arrayMatch = rawContent.match(/\[\s*{.*}\s*\]/s);
            if (arrayMatch) {
              parsedData = JSON.parse(arrayMatch[0]);
            } else {
              throw new Error("No JSON array pattern found");
            }
          } catch (extractError) {
            console.log("Extract parsing failed:", extractError);
            throw new Error("Could not parse file as JSON. Please check the file format.");
          }
        }
        
        console.log(`Parsed ${fileType} data type:`, typeof parsedData);
        
        // Find arrays in the parsed data
        let dataArray = findArraysInObject(parsedData);
        
        // Handle Instagram's nested structure
        if (!dataArray && parsedData.relationships) {
          // Try to extract from Instagram's relationships structure
          if (fileType === 'followers' && parsedData.relationships.followers) {
            dataArray = parsedData.relationships.followers;
          } else if (fileType === 'following' && parsedData.relationships.following) {
            dataArray = parsedData.relationships.following;
          }
        }
        
        // If we still don't have an array, check if the object has specific fields
        if (!dataArray && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
          for (const key in parsedData) {
            if (Array.isArray(parsedData[key]) && parsedData[key].length > 0) {
              dataArray = parsedData[key];
              break;
            }
          }
        }
        
        // Final check for array
        if (!Array.isArray(dataArray)) {
          throw new Error(`Could not find a data array in the ${fileType} file`);
        }
        
        console.log(`Found ${fileType} data array with ${dataArray.length} items`);
        console.log("First item sample:", dataArray[0]);
        
        if (fileType === 'followers') {
          setFollowersFile(file.name);
          setFollowersData(dataArray);
          toast.success(`Successfully loaded ${dataArray.length} followers`);
        } else {
          setFollowingFile(file.name);
          setFollowingData(dataArray);
          toast.success(`Successfully loaded ${dataArray.length} following accounts`);
        }
      } catch (error) {
        console.error(`Error processing ${fileType} file:`, error);
        toast.error(`Error: ${error.message || "Invalid file format"}`);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast.error(`Failed to read ${fileType} file`);
      setLoading(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload Instagram Data
        </h2>
        
        <div className="divider"></div>
        
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Upload your Instagram followers and following JSON files to find who doesn't follow you back</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Followers JSON</span>
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
              <span className="label-text-alt text-base-content/70">People who follow you</span>
            </label>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Following JSON</span>
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
              <span className="label-text-alt text-base-content/70">People you follow</span>
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
                  Both files loaded successfully
                </span> : 
                <span className="text-warning">
                  {!followersFile && !followingFile ? 
                    "Please upload both files" : 
                    `Still need to upload ${!followersFile ? "followers" : "following"} file`}
                </span>
              }
            </div>
            
            <button 
              className={`btn btn-primary ${loading ? 'loading' : ''}`} 
              onClick={processData}
              disabled={!followersFile || !followingFile || loading}
            >
              {loading ? 'Processing...' : 'Find Unfollowers'}
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