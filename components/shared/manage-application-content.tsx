'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PlanningApplication, RequestedService, ServiceRecord } from '@/lib/mock-data/schemas'
import { useRouter } from 'next/navigation'

interface ManageApplicationContentProps {
  application: PlanningApplication
}

// Service pricing configuration
const SERVICE_PRICING: Record<RequestedService, number> = {
  'written-advice': 500,
  'site-visit': 200,
  'meeting': 300,
}

const SERVICE_LABELS: Record<RequestedService, string> = {
  'written-advice': 'Written advice',
  'site-visit': 'Site visit',
  'meeting': 'Meeting',
}

export function ManageApplicationContent({ application }: ManageApplicationContentProps) {
  const router = useRouter()
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(
    application.serviceRecords || []
  )
  const [notes, setNotes] = useState('')
  const originalServices = application.requestedServices || []

  // Get additional services that can be added
  const availableAdditionalServices: RequestedService[] = ['site-visit', 'meeting']

  // Check if a service is currently active (included or added, not removed)
  const isServiceActive = (service: RequestedService): boolean => {
    const record = serviceRecords.find((r) => r.service === service && r.status !== 'removed')
    return !!record
  }

  // Handle toggling additional services
  const handleToggleAdditionalService = (service: RequestedService, checked: boolean) => {
    if (checked) {
      // Add service
      const newRecord: ServiceRecord = {
        id: `service-${Date.now()}`,
        service,
        status: 'added',
        cost: SERVICE_PRICING[service],
        addedDate: new Date().toISOString().split('T')[0],
        addedBy: 'Federico Carbo', // In real app, get from auth context
        notes: notes || undefined,
      }
      setServiceRecords([...serviceRecords, newRecord])
    } else {
      // Mark as removed (or remove if it was just added)
      setServiceRecords(
        serviceRecords.map((record) =>
          record.service === service && record.status === 'added'
            ? { ...record, status: 'removed' }
            : record
        )
      )
    }
  }

  // Calculate total cost
  const calculateTotal = (): number => {
    return serviceRecords
      .filter((record) => record.status !== 'removed')
      .reduce((sum, record) => sum + record.cost, 0)
  }

  const handleSave = () => {
    // In real app, persist to backend
    console.log('Saving service records:', serviceRecords)
    router.back()
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-card border border-border rounded-lg p-6 space-y-8">
        {/* Services Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-6">Services</h2>

          {/* Originally Requested Services */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Originally Requested
            </h3>
            <div className="space-y-3">
              {originalServices.map((service) => (
                <div key={service} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Checkbox checked disabled className="opacity-100" />
                    <Label className="font-normal cursor-default text-base">
                      {SERVICE_LABELS[service]}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    £{SERVICE_PRICING[service]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Additional Services
            </h3>
            <div className="space-y-3">
              {availableAdditionalServices.map((service) => {
                const isOriginal = originalServices.includes(service)
                const isAdded = isServiceActive(service) && !isOriginal

                return (
                  <div key={service} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isAdded}
                        onCheckedChange={(checked) =>
                          handleToggleAdditionalService(service, checked === true)
                        }
                        disabled={isOriginal}
                      />
                      <Label
                        htmlFor={service}
                        className={`font-normal text-base ${isOriginal ? 'cursor-default text-muted-foreground' : 'cursor-pointer'}`}
                      >
                        {isOriginal ? `${SERVICE_LABELS[service]} (already included)` : `Additional ${SERVICE_LABELS[service].toLowerCase()}`}
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      £{SERVICE_PRICING[service]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8">
            <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add justification for additional services..."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="pt-6 mt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-semibold">£{calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-border">
          <Button onClick={handleSave}>Save changes</Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
