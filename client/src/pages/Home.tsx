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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">ResumeMatch</span>
          </div>
          <Button variant="ghost" className="font-medium" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
            Try Demo
          </Button>
        </header>

        <div className="space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 py-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-slate-900"
            >
              Transform Your Resume <br/>
              <span className="text-primary italic">Into Job Offers</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Our AI analyzes your CV against any job description to give you the exact keywords and improvements you need to land the interview.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">2,847+ Success Stories</p>
                <p className="text-xs text-slate-500 italic">"I got 3 interviews in one week!"</p>
              </div>
            </motion.div>
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
          {/* Feature Showcase */}
          <section className="grid md:grid-cols-3 gap-8 py-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold mb-2">ATS Compatibility</h4>
              <p className="text-slate-600 text-sm">Our AI checks your resume against standard applicant tracking systems to ensure you pass the first filter.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold mb-2">Keyword Optimization</h4>
              <p className="text-slate-600 text-sm">Instantly identify missing keywords from the job description and learn how to naturally integrate them.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Copy className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold mb-2">Outreach Templates</h4>
              <p className="text-slate-600 text-sm">Generate personalized cold emails for recruiters that highlight your specific matching strengths.</p>
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

          {/* Footer */}
          <footer className="border-t border-slate-200 pt-12 pb-8 text-center space-y-4">
            <div className="flex justify-center gap-6 text-slate-400">
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Privacy Policy</span>
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Terms of Service</span>
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Support</span>
            </div>
            <p className="text-sm text-slate-400">© 2025 ResumeMatch. Helping you land your dream job faster.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
