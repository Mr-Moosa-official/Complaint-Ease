"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getComplaintById, Complaint } from "@/lib/complaints-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, MapPin, Calendar, Tag, CheckCircle2, Circle, Clock, MessageSquare } from "lucide-react"

export default function ComplaintDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [complaint, setComplaint] = useState<Complaint | null>(null)

  useEffect(() => {
    if (id) {
      const found = getComplaintById(id as string)
      setComplaint(found || null)
    }
  }, [id])

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold font-headline">Complaint Not Found</h2>
        <p className="text-muted-foreground mb-6">The complaint ID you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/history")}>Back to History</Button>
      </div>
    )
  }

  const getProgress = (status: string) => {
    switch (status) {
      case 'Submitted': return 20
      case 'Processing': return 40
      case 'Investigating': return 70
      case 'Resolved': return 100
      case 'Closed': return 100
      default: return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500/10 text-blue-600'
      case 'Processing': return 'bg-yellow-500/10 text-yellow-600'
      case 'Investigating': return 'bg-orange-500/10 text-orange-600'
      case 'Resolved': return 'bg-green-500/10 text-green-600'
      case 'Closed': return 'bg-gray-500/10 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <MessageSquare className="h-5 w-5" />
      case 'Processing': return <Clock className="h-5 w-5" />
      case 'Investigating': return <Tag className="h-5 w-5" />
      case 'Resolved': return <CheckCircle2 className="h-5 w-5" />
      case 'Closed': return <Circle className="h-5 w-5" />
      default: return <Circle className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">{complaint.title}</h1>
            <Badge variant="outline" className={getStatusColor(complaint.status)}>
              {complaint.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Case Reference: {complaint.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Issue Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {complaint.keywords.map(kw => (
                  <Badge key={kw} variant="secondary" className="bg-primary/5 text-primary/70 border-none">
                    #{kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Timeline & Status Updates</CardTitle>
              <CardDescription>Real-time updates on your complaint's progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                {complaint.updates.map((update, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[19px] top-1 p-1 rounded-full border-2 bg-background z-10 
                      ${idx === 0 ? 'border-primary' : 'border-muted-foreground/30'}`}>
                      {getStatusIcon(update.status)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${idx === 0 ? 'text-primary' : 'text-foreground'}`}>
                          {update.status}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(update.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {update.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Case Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resolution Progress</span>
                  <span className="font-bold text-primary">{getProgress(complaint.status)}%</span>
                </div>
                <Progress value={getProgress(complaint.status)} className="h-2" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted on</p>
                    <p className="text-sm font-medium">{new Date(complaint.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{complaint.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned Department</p>
                    <p className="text-sm font-medium">{complaint.category} Team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-accent/30 border-none">
            <CardHeader>
              <CardTitle className="font-headline text-md">Need to talk?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                If you have additional information to provide for this case, you can contact our support line directly.
              </p>
              <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5">
                Call Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}