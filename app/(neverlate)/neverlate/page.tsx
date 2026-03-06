'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Shield, 
  Bell, 
  Users, 
  FileText, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

export default function NeverLateLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="neverlate-section pt-20 pb-16">
        <div className="neverlate-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Your personal life admin OS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            NeverLate
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Track passports, visas, licenses, subscriptions, and family renewals 
            in one calm, simple place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/neverlate/app">
              <Button size="lg" className="text-lg px-8 py-6 neverlate-gradient">
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Explanation */}
      <section className="neverlate-section bg-muted/30">
        <div className="neverlate-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Life is complex. Your admin shouldn't be.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              NeverLate helps you track important documents and renewals for yourself and your family. 
              No spreadsheets. No clutter. Just calm, simple control.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="neverlate-section">
        <div className="neverlate-container">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track documents for yourself, spouse, children, parents, and business entities all in one place.
              </p>
            </Card>

            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart OCR Upload</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload documents and let OCR extract key details automatically. Review and confirm in seconds.
              </p>
            </Card>

            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Reminders</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get notified 90, 60, 30, and 7 days before expiry. Never miss a renewal again.
              </p>
            </Card>

            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Clear Urgency</h3>
              <p className="text-muted-foreground leading-relaxed">
                See what's urgent, upcoming, or safe at a glance. No guessing. No stress.
              </p>
            </Card>

            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Life Health Score</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visual score per profile shows your admin health. Feel in control instantly.
              </p>
            </Card>

            <Card className="neverlate-card p-8">
              <div className="w-12 h-12 rounded-xl neverlate-gradient flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Feel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Calm, modern design that feels like a premium product. Simplicity is the feature.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="neverlate-section bg-muted/30">
        <div className="neverlate-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full neverlate-gradient flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create Profiles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add profiles for yourself, family members, or business entities. Each profile gets its own dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full neverlate-gradient flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Take a photo or upload a PDF. OCR extracts key details like expiry dates automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full neverlate-gradient flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See what's urgent, upcoming, or safe. Get reminders before things expire. Feel in control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="neverlate-section">
        <div className="neverlate-container">
          <Card className="neverlate-card p-12 text-center neverlate-gradient-subtle">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to take control?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who've simplified their life admin with NeverLate.
            </p>
            <Link href="/neverlate/app">
              <Button size="lg" className="text-lg px-8 py-6 neverlate-gradient">
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="neverlate-container text-center text-sm text-muted-foreground">
          <p>Part of <Link href="/" className="text-primary hover:underline">zee.build</Link> — Systems That Ship</p>
        </div>
      </footer>
    </div>
  );
}
