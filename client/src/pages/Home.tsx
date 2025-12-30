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
        <header className="text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <Briefcase className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              Job Match Analyzer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and a job description to get an AI-powered match analysis, skill gap assessment, and a tailored cold email.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <section className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-400" />
              <CardHeader>
                <CardTitle>Analysis Inputs</CardTitle>
                <CardDescription>Provide the details for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
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
                      "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all duration-200 group-hover:border-primary/50 group-hover:bg-primary/5",
                      file ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/5"
                    )}>
                      {file ? (
                        <div className="flex items-center space-x-2 text-primary">
                          <FileText className="w-8 h-8" />
                          <span className="font-semibold">{file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
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
                    className="min-h-[200px] resize-none text-base"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
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
          <section className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}
