"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { suggestComplaintCategories } from "@/ai/flows/suggest-complaint-categories"
import { addComplaint } from "@/lib/complaints-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, Send, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = ["Billing", "Technical", "Customer Support", "Service Quality", "Product Feature", "Other"];

export default function NewComplaint() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    keywords: [] as string[]
  })

  const handleSuggest = async () => {
    if (!formData.description) {
      toast({
        title: "Missing description",
        description: "Please provide a description first to get AI suggestions.",
        variant: "destructive"
      })
      return
    }

    setIsSuggesting(true)
    try {
      const result = await suggestComplaintCategories({ description: formData.description })
      
      // Map suggested category to our known ones if possible, or just use the first suggestion
      const suggestedCategory = result.categories[0]
      const bestMatch = CATEGORIES.find(c => c.toLowerCase() === suggestedCategory.toLowerCase()) || "Other"

      setFormData(prev => ({
        ...prev,
        category: bestMatch,
        keywords: result.keywords
      }))
      
      toast({
        title: "AI Suggestions Ready",
        description: `We've identified this as a ${bestMatch} issue.`
      })
    } catch (error) {
      toast({
        title: "AI Suggestion Failed",
        description: "We couldn't analyze the text right now. Please select manually.",
        variant: "destructive"
      })
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    // Simulate API call delay
    setTimeout(() => {
      addComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: "Submitted",
        keywords: formData.keywords
      })
      
      setIsSubmitting(false)
      toast({
        title: "Success",
        description: "Your complaint has been submitted and is being processed."
      })
      router.push("/history")
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline text-primary">File a Complaint</h1>
        <p className="text-muted-foreground">Describe your issue in detail and we'll help categorize it using AI.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Complaint Details</CardTitle>
            <CardDescription>All fields are required to process your request efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input 
                id="title" 
                placeholder="Briefly state the problem" 
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Detailed Description</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                  onClick={handleSuggest}
                  disabled={isSuggesting || !formData.description}
                >
                  {isSuggesting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  Auto-Categorize
                </Button>
              </div>
              <Textarea 
                id="description" 
                placeholder="Provide as much detail as possible..." 
                className="min-h-[150px]"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.keywords.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Detected Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map(kw => (
                    <Badge key={kw} variant="secondary" className="bg-primary/10 text-primary border-none">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setFormData({ title: "", description: "", category: "", keywords: [] })}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Complaint
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}