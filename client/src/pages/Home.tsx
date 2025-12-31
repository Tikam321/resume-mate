import React, { useState } from "react";
import { useAnalyzeResume } from "@/hooks/use-analyze";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Copy, 
  Loader2,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const { mutate: analyze, isPending, data: result, error } = useAnalyzeResume();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = () => {
    if (!file || !jobDescription) {
      toast({
        title: "Missing fields",
        description: "Please upload a resume and enter a job description.",
        variant: "destructive",
      });
      return;
    }
    analyze({ resume: file, job_description: jobDescription });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Cold email copied to clipboard.",
    });
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return "text-green-600";
    if (numScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreProgressColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return "bg-green-600";
    if (numScore >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <header className="flex items-center justify-between py-4 px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">Resume Mate</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Demo', 'How It Works', 'Success Stories', 'Pricing', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <Button className="bg-[#56B381] hover:bg-[#4aa574] text-white font-bold px-6 rounded-lg shadow-sm">
            Analyze My Resume Free
          </Button>
        </header>

        <div className="space-y-16">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8 py-20 px-6 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#2B458C] via-[#3D69C4] to-[#4EA9B3] text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
              <span className="text-amber-400">✦</span>
              <span className="text-sm font-semibold tracking-wide">Trusted by 50,000+ Job Seekers</span>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Get Your Dream Job 3X Faster
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium"
            >
              AI analyzes your resume in 60 seconds and writes the perfect cold email to reach hiring managers directly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 pt-6"
            >
              <Button size="lg" className="bg-[#56B381] hover:bg-[#4aa574] text-white font-bold h-16 px-10 text-lg rounded-xl shadow-2xl shadow-[#56B381]/20 group">
                <Upload className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Upload Resume for Free Analysis
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-blue-900 border-0 h-16 px-10 text-lg font-bold rounded-xl shadow-2xl shadow-black/10 hover:bg-slate-50 transition-all">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-blue-900 border-b-[8px] border-b-transparent mr-3" />
                Watch 2-Minute Demo
              </Button>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8 pt-10 text-sm font-semibold text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px]">🛡</span>
                </div>
                100% Privacy Guaranteed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px]">⏰</span>
                </div>
                Results in 60 Seconds
              </div>
            </div>
          </section>

          {/* Interactive Demo Section */}
          <section id="demo" className="scroll-mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Interactive Analyzer</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Demo
              </div>
            </div>
            <Card className="border-0 shadow-2xl bg-white overflow-hidden ring-1 ring-slate-200">
              <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-400" />
              <CardHeader>
                <CardTitle>Analysis Inputs</CardTitle>
                <CardDescription>Provide the details for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Resume and Job Description Stack */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Resume Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Upload Resume (PDF)
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-200 group-hover:border-primary/50 group-hover:bg-primary/5",
                        file ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/5"
                      )}>
                        {file ? (
                          <div className="flex flex-col items-center space-y-2 text-primary">
                            <FileText className="w-12 h-12" />
                            <span className="font-semibold text-center px-4 break-all">{file.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                            <p className="text-sm text-muted-foreground font-medium">Click to upload or drag & drop</p>
                            <p className="text-xs text-muted-foreground/70">PDF files only</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium leading-none">
                      Job Description
                    </label>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      className="h-48 resize-none text-base"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl" 
                  onClick={handleAnalyze}
                  disabled={isPending || !file || !jobDescription}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm flex items-start border border-red-100">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                    <span>{error.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Results Section */}
          <section className="w-full space-y-8">
            <AnimatePresence mode="wait">
              {!result && !isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-muted-foreground/10 min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold text-muted-foreground">Ready to Analyze</h3>
                  <p className="text-muted-foreground/70 mt-2 max-w-xs">
                    Upload your resume and paste a job description to see how well you match.
                  </p>
                </motion.div>
              )}

              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center min-h-[400px]"
                >
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Analyzing your profile...</p>
                  <p className="text-sm text-muted-foreground/60">This helps us tailor the best results for you.</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <div className={cn("h-2 w-full", getScoreProgressColor(result.match_score))} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Match Score</CardTitle>
                        <span className={cn("text-4xl font-bold", getScoreColor(result.match_score))}>
                          {result.match_score}%
                        </span>
                      </div>
                      <Progress value={parseInt(result.match_score)} className="h-3" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="flex items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            Matching Strengths
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.matching_strengths.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="flex items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                            Missing Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.missing_skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggestions Card */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                        Improvement Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.improvement_suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start text-sm md:text-base text-muted-foreground bg-gray-50 p-3 rounded-lg">
                            <span className="mr-3 font-bold text-primary/40 text-lg">{(i + 1).toString().padStart(2, '0')}</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Cold Email Card */}
                  <Card className="border-0 shadow-lg bg-white border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Generated Cold Email</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.cold_email)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <CardDescription>A recruiter-ready email tailored to this role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-4 rounded-lg text-sm md:text-base whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed border border-border">
                        {result.cold_email}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
          {/* Stats Section */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-100">
            {[
              { label: "Job Seekers Helped", value: "50,000+", icon: "👥" },
              { label: "Get More Interviews", value: "87%", icon: "📈" },
              { label: "Faster Job Placement", value: "3X", icon: "⚡" },
              { label: "Average Rating", value: "4.9/5", icon: "⭐" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-2xl">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Problem Section */}
          <section className="py-20 text-center space-y-12">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-blue-900 tracking-tight">The Resume Black Hole Problem</h3>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Your resume is getting lost in automated systems, and you're missing opportunities you're qualified for.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: "of resumes never reach human eyes", value: "73%", icon: "👁️" },
                { label: "applications per job posting", value: "250+", icon: "📄" },
                { label: "average time recruiters spend per resume", value: "6 sec", icon: "⏱️" }
              ].map((item, i) => (
                <Card key={i} className="p-8 border-0 shadow-sm bg-white ring-1 ring-slate-100">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">{item.value}</div>
                  <p className="text-sm text-slate-500 font-medium">{item.label}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 space-y-12">
            <h3 className="text-3xl font-bold text-center text-blue-900">Real Stories from Frustrated Job Seekers</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Michael Chen", role: "Software Engineer", text: "I sent 200+ applications and heard nothing back. I felt invisible in the job market." },
                { name: "Sarah Johnson", role: "Marketing Manager", text: "My resume looked great to me, but I had no idea it was being rejected by ATS systems." },
                { name: "David Peterson", role: "Financial Analyst", text: "I wasted months applying to job boards with zero results. Everything needed to change." }
              ].map((story, i) => (
                <Card key={i} className="p-8 border-0 shadow-sm bg-slate-50 relative group hover:bg-white hover:ring-1 hover:ring-slate-200 transition-all">
                  <p className="italic text-slate-600 mb-6 font-medium">"{story.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                      {story.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{story.name}</p>
                      <p className="text-sm text-slate-500">{story.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto py-12 text-center space-y-8">
            <h3 className="text-3xl font-bold">Frequently Asked Questions</h3>
            <div className="grid gap-4 text-left">
              {[
                { q: "How accurate is the matching?", a: "Our AI uses advanced NLP to understand context, not just keyword counts, providing over 95% accuracy in skill gap identification." },
                { q: "Is my data secure?", a: "We don't store your resumes. Analysis is performed in-memory and cleared immediately after your session ends." },
                { q: "Does it support all PDF formats?", a: "It works best with text-based PDFs. Scanned images may require OCR which we recommend doing before upload." }
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl">
                  <h5 className="font-bold text-slate-900 mb-2">{faq.q}</h5>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Section */}
          <footer className="bg-blue-900 text-white py-20 mt-20 rounded-t-[3rem] px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">Resume Mate</span>
                </div>
                <p className="text-blue-200 max-w-sm">
                  Transform your job search with AI-powered resume optimization and personalized cold email templates.
                </p>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                      <span className="text-xs">🔗</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-bold mb-6">Product</h5>
                <ul className="space-y-4 text-blue-200 text-sm">
                  <li className="hover:text-white cursor-pointer">Features</li>
                  <li className="hover:text-white cursor-pointer">Pricing</li>
                  <li className="hover:text-white cursor-pointer">Success Stories</li>
                  <li className="hover:text-white cursor-pointer">FAQ</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-6">Support</h5>
                <ul className="space-y-4 text-blue-200 text-sm">
                  <li className="hover:text-white cursor-pointer">Help Center</li>
                  <li className="hover:text-white cursor-pointer">Contact Us</li>
                  <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer">Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-300 text-xs">
              <p>© 2025 Resume Mate. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
                <span className="hover:text-white cursor-pointer">Cookie Policy</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
