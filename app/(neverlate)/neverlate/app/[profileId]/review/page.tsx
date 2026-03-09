'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  X, 
  FileText,
  AlertCircle,
  FileSearch,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OCRReview() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const profileId = params.profileId as string;
  const initialType = searchParams.get('type') || 'Passport';

  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState({
    category: initialType,
    name: 'Doe, John',
    document_number: 'P123456789',
    issue_date: '2020-05-12',
    expiry_date: '2029-05-11',
    nationality: 'United States',
    notes: ''
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // In a real app we would save the document to state/DB here
      router.push(`/neverlate/app/${profileId}/documents`);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen p-6 neverlate-fade-in relative z-0 flex flex-col">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="neverlate-container w-full max-w-6xl flex-1 flex flex-col pt-4">
        
        {/* Header Ribbon */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span className="text-teal-400 font-medium">Scan successful. Please confirm the extracted details below.</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push(`/neverlate/app/${profileId}/upload`)}
            className="text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Left: Document Preview */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="h-full min-h-[500px] glass-panel rounded-3xl p-6 border border-white/10 flex flex-col relative overflow-hidden group">
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
                <FileSearch className="w-3 h-3 text-teal-400" />
                Original Document
              </div>
              
              <div className="flex-1 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col justify-center items-center relative overflow-hidden">
                <ImageIcon className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-slate-500 font-medium">Document Preview</p>
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent mix-blend-overlay pointer-events-none" />
                
                {/* Mock Highlights over image to simulate OCR boxes */}
                <div className="absolute top-1/4 left-1/4 w-32 h-6 border-b border-teal-500/50 bg-teal-500/10" />
                <div className="absolute top-1/3 right-1/4 w-48 h-6 border-b border-teal-500/50 bg-teal-500/10" />
                <div className="absolute bottom-1/3 left-1/3 w-40 h-6 border-b border-teal-500/50 bg-teal-500/10" />
              </div>
            </div>
          </motion.div>

          {/* Right: Editable Fields */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <FileText className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Extracted Details</h2>
                  <p className="text-sm text-slate-400">Review and edit any incorrect fields</p>
                </div>
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Document Type</Label>
                    <Input 
                      name="category"
                      value={fields.category} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12 focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Nationality</Label>
                    <Input 
                      name="nationality"
                      value={fields.nationality} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12 focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Name on Document</Label>
                  <Input 
                    name="name"
                    value={fields.name} 
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white h-12 focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Document Number</Label>
                    <AlertCircle className="w-4 h-4 text-orange-400/80" />
                  </div>
                  <Input 
                    name="document_number"
                    value={fields.document_number} 
                    onChange={handleChange}
                    className="bg-orange-500/5 border-orange-500/20 text-white h-12 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                  />
                  <p className="text-[10px] text-orange-400">Please verify this field carefully.</p>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Issue Date</Label>
                    <Input 
                      type="date"
                      name="issue_date"
                      value={fields.issue_date} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Expiry Date</Label>
                    <Input 
                      type="date"
                      name="expiry_date"
                      value={fields.expiry_date} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Personal Notes (Optional)</Label>
                  <Textarea 
                    name="notes"
                    value={fields.notes} 
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" 
                    placeholder="Add any reminders or notes about this document..."
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <Button 
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold"
                  onClick={() => router.push(`/neverlate/app/${profileId}/upload`)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-2xl neverlate-gradient font-bold shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2 text-black" />
                      Confirm & Save
                    </>
                  )}
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
