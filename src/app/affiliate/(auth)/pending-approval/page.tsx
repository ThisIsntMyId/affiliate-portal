"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Clock, HelpCircle } from 'lucide-react'

export default function AffiliatePendingApprovalPage() {
  return (
    <Card className="w-full text-center">
      <CardHeader className="pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Account Pending Approval
        </CardTitle>
        <CardDescription className="text-gray-600">
          Your affiliate account is currently being reviewed by the brand
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Please wait while the brand reviews your application</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            We&apos;re reviewing your affiliate application to ensure everything meets our requirements. 
            This process typically takes 1-3 business days.
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            If you have any questions or if your account hasn&apos;t been approved within the expected timeframe, 
            please don&apos;t hesitate to contact the brand support team.
          </p>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log('Contact support clicked')}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Brand Support
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
