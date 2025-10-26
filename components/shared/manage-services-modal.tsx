'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { RequestedService, ServiceRecord } from '@/lib/mock-data/schemas'

interface ManageServicesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalServices: RequestedService[]
  serviceRecords: ServiceRecord[]
  onSave: (updatedRecords: ServiceRecord[]) => void
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

export function ManageServicesModal({
  open,
  onOpenChange,
  originalServices,
  serviceRecords,
  onSave,
}: ManageServicesModalProps) {
  const [localRecords, setLocalRecords] = useState<ServiceRecord[]>(serviceRecords)
  const [notes, setNotes] = useState('')

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalRecords(serviceRecords)
      setNotes('')
    }
  }, [open, serviceRecords])

  // Get additional services that can be added
  const availableAdditionalServices: RequestedService[] = ['site-visit', 'meeting']

  // Check if a service is currently active (included or added, not removed)
  const isServiceActive = (service: RequestedService): boolean => {
    const record = localRecords.find((r) => r.service === service && r.status !== 'removed')
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
      setLocalRecords([...localRecords, newRecord])
    } else {
      // Mark as removed (or remove if it was just added)
      setLocalRecords(
        localRecords.map((record) =>
          record.service === service && record.status === 'added'
            ? { ...record, status: 'removed' }
            : record
        )
      )
    }
  }

  // Calculate total cost
  const calculateTotal = (): number => {
    return localRecords
      .filter((record) => record.status !== 'removed')
      .reduce((sum, record) => sum + record.cost, 0)
  }

  const handleSave = () => {
    onSave(localRecords)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Services</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Originally Requested Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Originally Requested
            </h3>
            <div className="space-y-2">
              {originalServices.map((service) => (
                <div key={service} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Checkbox checked disabled className="opacity-100" />
                    <Label className="font-normal cursor-default">
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Additional Services
            </h3>
            <div className="space-y-2">
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
                        className={`font-normal ${isOriginal ? 'cursor-default text-muted-foreground' : 'cursor-pointer'}`}
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
          <div>
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
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-semibold">£{calculateTotal()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
