import React from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const OPENINGS = [
  { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Jakarta / Remote', type: 'Full-time' },
  { title: 'UI/UX Designer', dept: 'Design', location: 'Jakarta', type: 'Full-time' },
  { title: 'Content Writer (Bahasa)', dept: 'Marketing', location: 'Remote', type: 'Contract' },
  { title: 'Warehouse Operations Lead', dept: 'Operations', location: 'Tangerang', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Careers</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Join the Collective</h1>
          <p className="text-ag-text-2 max-w-lg mx-auto">We&apos;re building the future of intentional commerce. If you believe in craft over convention, we want to hear from you.</p>
        </header>

        <div className="space-y-4 mb-16">
          {OPENINGS.map((job, i) => (
            <div key={i} className="p-6 bg-ag-bg-2 border border-ag-border hover:border-ag-accent/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div>
                <h3 className="text-ag-text font-medium text-lg group-hover:text-ag-accent transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-ag-muted font-mono">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                </div>
              </div>
              <a href="mailto:careers@vellure.id" className="shrink-0 border border-ag-border text-ag-text px-6 py-2.5 font-mono text-xs uppercase tracking-widest hover:bg-ag-accent hover:text-ag-bg hover:border-ag-accent transition-colors text-center">
                Apply
              </a>
            </div>
          ))}
        </div>

        <div className="text-center p-8 border border-ag-border border-dashed text-ag-text-2 text-sm">
          Don&apos;t see a role that fits? Send your resume to <a href="mailto:careers@vellure.id" className="text-ag-accent hover:text-ag-text transition-colors">careers@vellure.id</a>
        </div>
      </div>
    </div>
  );
}
