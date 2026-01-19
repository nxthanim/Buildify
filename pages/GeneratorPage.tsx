
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateAppFromPrompt } from '../services/geminiService';
import { mockApi } from '../services/mockApi';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Input from '../components/Input';
import { Globe, Smartphone, Tablet, ArrowRight, ArrowLeft } from 'lucide-react';

type Platform = 'Web' | 'iOS' | 'Android';

const GeneratorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [appName, setAppName] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('Web');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    if (step === 1 && (!appName || !description)) {
        setError("Please fill out both App Name and Description.");
        return;
    }
    setError('');
    if (step < 3) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    
    try {
      const fullPrompt = `Create a ${platform} application named "${appName}". Description: ${description}.`;
      const appDetails = await generateAppFromPrompt(fullPrompt);
      // We can enrich appDetails with the info from the form
      const finalAppDetails = {
        ...appDetails,
        name: appName,
        description: description,
      };

      await mockApi.createApp(user.id, finalAppDetails);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to generate the app. The AI might be busy or the request was too complex. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndicator = (stepNum: number, label: string) => {
    const isActive = step === stepNum;
    const isCompleted = step > stepNum;
    return (
        <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-primary border-primary' : isCompleted ? 'bg-secondary border-secondary' : 'border-border'}`}>
                <span className={`${isActive || isCompleted ? 'text-white' : 'text-text-secondary'}`}>{isCompleted ? '✔' : stepNum}</span>
            </div>
            <p className={`mt-2 text-sm ${isActive || isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>{label}</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-text-primary mb-2">App Creation Wizard</h1>
        <p className="text-text-secondary text-center mb-8">Follow the steps to configure and generate your new application.</p>
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center my-8 px-4">
            {getStepIndicator(1, 'Basics')}
            <div className={`flex-1 h-0.5 mx-4 ${step > 1 ? 'bg-secondary' : 'bg-border'}`}></div>
            {getStepIndicator(2, 'Config')}
            <div className={`flex-1 h-0.5 mx-4 ${step > 2 ? 'bg-secondary' : 'bg-border'}`}></div>
            {getStepIndicator(3, 'Review')}
        </div>

        {/* Step Content */}
        {isLoading ? (
            <Spinner message="Building your masterpiece..." />
        ) : (
            <div className="space-y-6">
                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-1">General Information</h2>
                        <p className="text-text-secondary mb-6">Start by giving your application a name and description.</p>
                        <div className="space-y-4">
                            <Input label="App Name" id="appName" placeholder="e.g. Acme Dashboard" value={appName} onChange={e => setAppName(e.target.value)} />
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What will this app do?"
                                    className="w-full h-32 p-3 bg-surface-accent border border-border rounded-lg text-text-primary placeholder-gray-500 focus:ring-primary focus:border-primary transition"
                                />
                            </div>
                            <div>
                                <p className="block text-sm font-medium text-text-secondary mb-2">Target Platform</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['Web', 'iOS', 'Android'] as Platform[]).map(p => (
                                        <button key={p} onClick={() => setPlatform(p)} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition ${platform === p ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                            {p === 'Web' && <Globe size={24} />}
                                            {p === 'iOS' && <Smartphone size={24} />}
                                            {p === 'Android' && <Tablet size={24} />}
                                            <span className="mt-2 text-sm font-semibold">{p}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Configuration</h2>
                        <p className="text-text-secondary mb-6">Specify additional details for the AI.</p>
                        <div className="space-y-4">
                            <Input label="Primary Color" id="primaryColor" placeholder="#4F46E5" />
                            <Input label="Key Features (comma-separated)" id="features" placeholder="User auth, dashboard, analytics" />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Review & Generate</h2>
                        <p className="text-text-secondary mb-6">Please review your app configuration before we start building.</p>
                        <div className="bg-surface-accent p-4 rounded-lg space-y-2 text-sm">
                           <p><strong className="text-text-secondary">Name:</strong> {appName}</p>
                           <p><strong className="text-text-secondary">Description:</strong> {description}</p>
                           <p><strong className="text-text-secondary">Platform:</strong> {platform}</p>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                
                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-border">
                    {step > 1 ? (
                         <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
                            Back
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </Button>
                    )}
                    
                    {step < 3 && (
                         <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
                            Continue
                        </Button>
                    )}
                    {step === 3 && (
                        <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
                            Generate App
                        </Button>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;
