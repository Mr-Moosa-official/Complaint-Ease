"use client"

import { useState, useEffect } from "react"
import { getComplaints, Complaint } from "@/lib/complaints-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle2, ArrowRight, AlertCircle, PlusCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    setComplaints(getComplaints())
  }, [])

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
    active: complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline text-primary">Overview</h1>
        <p className="text-muted-foreground">Monitor the status of your active and past complaints.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successfully Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
              <CardDescription>Latest updates on your filed complaints.</CardDescription>
            </div>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {complaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p>No complaints found. File your first one today!</p>
                </div>
              ) : (
                complaints.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground">ID: {complaint.id} • {new Date(complaint.date).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Resolution Progress</span>
                        <span>{getProgress(complaint.status)}%</span>
                      </div>
                      <Progress value={getProgress(complaint.status)} className="h-1.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground shadow-lg overflow-hidden relative">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Need Assistance?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Our AI-powered system makes filing and categorizing issues effortless.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed">
              Submit your concern with a few details, and we'll handle the rest. Track every step of the process in real-time.
            </p>
            <Link href="/new-complaint" className="inline-block">
              <Button variant="secondary" size="lg" className="font-bold">
                <PlusCircle className="mr-2 h-5 w-5" /> File New Complaint
              </Button>
            </Link>
          </CardContent>
          <div className="absolute bottom-0 right-0 p-4 opacity-10">
             <MessageSquare className="h-32 w-32" />
          </div>
        </Card>
      </div>
    </div>
  )
}
