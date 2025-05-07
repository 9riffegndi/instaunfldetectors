import { useState } from 'react'

export default function WelcomeModal({ onClose, t }) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  
  const closeModal = () => {
    if (onClose) onClose()
  }
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      closeModal()
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeModal}></div>
      <div className="modal modal-open z-50">
        <div className="modal-box max-w-3xl">
          <div className="absolute top-4 right-4">
            <button onClick={closeModal} className="btn btn-sm btn-circle">✕</button>
          </div>
          
          <h3 className="font-bold text-2xl mb-6">
            {t.welcomeTitle}
          </h3>
          
          <div className="p-2">
            {currentStep === 1 && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">{t.step1Title}</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {t.step1Instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">{t.step2Title}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {t.step2Instructions.slice(0, 3).map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}                      
                      <ul className="list-inside pl-5 mt-1">
                        <li><span className="font-mono text-sm bg-base-200 px-1 rounded">{t.followersFile}</span></li>
                        <li><span className="font-mono text-sm bg-base-200 px-1 rounded">{t.followingFile}</span></li>
                      </ul>
                    {t.step2Instructions.slice(3).map((instruction, index) => (
                      <li key={index + 3}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">{t.step3Title}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {t.step3Instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                  <div className="alert alert-info mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{t.dataPrivacyNote}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-action mt-8">
            <div className="flex items-center justify-between w-full">
              <div>
                {currentStep > 1 ? (
                  <button onClick={prevStep} className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {t.previous}
                  </button>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${currentStep === index + 1 ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
              
              <button onClick={nextStep} className="btn btn-primary">
                {currentStep === totalSteps ? t.getStarted : t.next}
                {currentStep !== totalSteps && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}