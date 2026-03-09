'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Upload, 
  FileText,
  Camera,
  FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DOCUMENT_TYPES = [
  'Passport', 'Visa', 'Driving License', 'Insurance', 'Subscription', 'Trade License', 'Other'
];

export default function UploadDocument() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleSimulateUpload = () => {
    setIsUploading(true);
    // Simulate OCR processing time
    setTimeout(() => {
      router.push(`/neverlate/app/${profileId}/review?type=${selectedType || 'Other'}`);
    }, 2500);
  };

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0 flex flex-col">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="neverlate-container max-w-4xl flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href={`/neverlate/app/${profileId}`} className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Upload Document</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our smart OCR will automatically extract the details. You'll just need to review and confirm.
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
          
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div 
                key="uploading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-32 h-32 mb-8">
                  {/* Glowing rings animation */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-4 border-teal-500/30"
                  />
                  <motion.div 
                    animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="absolute inset-0 rounded-full border-4 border-teal-500/20"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileSearch className="w-12 h-12 text-teal-400" />
                  </div>

                  {/* Scanning beam */}
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Document...</h3>
                <p className="text-slate-400">Extracting dates, names, and key info</p>
              </motion.div>
            ) : (
              <motion.div 
                key="upload-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full space-y-8"
              >
                {/* Dropzone */}
                <Card 
                  onClick={handleSimulateUpload}
                  className="glass-panel border-2 border-dashed border-white/20 hover:border-teal-400/50 rounded-[2.5rem] p-16 text-center cursor-pointer transition-all hover:bg-white/5 group"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/10 transition-all duration-300">
                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Click or drag document here</h3>
                  <p className="text-slate-400 mb-6 font-medium">Supports PDF, PNG, JPG up to 10MB</p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm font-medium">
                    <Button variant="outline" className="rounded-full bg-transparent border-white/10 text-white pointer-events-none">
                      <FileText className="w-4 h-4 mr-2 text-slate-400" />
                      Browse Files
                    </Button>
                    <span className="text-slate-600">or</span>
                    <Button variant="outline" className="rounded-full bg-transparent border-white/10 text-white pointer-events-none">
                      <Camera className="w-4 h-4 mr-2 text-slate-400" />
                      Take Photo
                    </Button>
                  </div>
                </Card>

                {/* Document Type Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Select Type (Optional)</h4>
                  <div className="flex flex-wrap gap-2">
                    {DOCUMENT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedType === type 
                            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
