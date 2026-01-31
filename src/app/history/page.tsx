"use client"

import { useState, useEffect } from "react"
import { getComplaints, Complaint } from "@/lib/complaints-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpRight, MessageSquareOff } from "lucide-react"
import Link from "next/link"

export default function History() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setComplaints(getComplaints())
  }, [])

  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline text-primary">Complaint History</h1>
        <p className="text-muted-foreground">View and track all your previous and ongoing reports.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, title or category..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter Results
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredComplaints.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <MessageSquareOff className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline">No records found</h3>
                <p className="text-muted-foreground max-w-sm">
                  We couldn't find any complaints matching your criteria. Try adjusting your search or file a new issue.
                </p>
              </div>
              <Link href="/new-complaint">
                <Button>File New Complaint</Button>
              </Link>
            </div>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Link key={complaint.id} href={`/complaint/${complaint.id}`}>
              <Card className="hover:border-primary/50 transition-colors shadow-sm overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{complaint.id}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs font-medium text-primary">{complaint.category}</span>
                          </div>
                          <h3 className="text-lg font-bold font-headline group-hover:text-primary transition-colors">{complaint.title}</h3>
                        </div>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {complaint.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          Last Update: {new Date(complaint.updates[complaint.updates.length - 1].date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center px-8 border-l bg-muted/30 group-hover:bg-primary/5 transition-colors">
                      <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}