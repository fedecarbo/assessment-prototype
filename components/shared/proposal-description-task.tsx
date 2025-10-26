'use client'

import { useState, useEffect, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useFutureAssessment } from './future-assessment-context'

interface ProposalDescriptionTaskProps {
  originalDescription: string
}

export function ProposalDescriptionTask({ originalDescription }: ProposalDescriptionTaskProps) {
  const { proposalDescriptionDraft, updateProposalDescription } = useFutureAssessment()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize draft with original description if empty
  useEffect(() => {
    if (!proposalDescriptionDraft && originalDescription) {
      updateProposalDescription(originalDescription)
    }
  }, [originalDescription, proposalDescriptionDraft, updateProposalDescription])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '140px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.max(140, scrollHeight) + 'px'
    }
  }, [proposalDescriptionDraft])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProposalDescription(e.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Read-only original description */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Original proposal description
        </h3>
        <div className="border border-border bg-muted p-4">
          <p className="text-base leading-relaxed text-foreground">
            {originalDescription}
          </p>
        </div>
      </div>

      {/* Editable description */}
      <div>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Officer&apos;s edited description
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          Make changes if needed for clarity or accuracy
        </p>
        <Textarea
          ref={textareaRef}
          value={proposalDescriptionDraft}
          onChange={handleTextChange}
          className="text-base leading-relaxed resize-none overflow-hidden"
          style={{ minHeight: '140px' }}
          placeholder="Enter description..."
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Character count: {proposalDescriptionDraft.length}
        </p>
      </div>
    </div>
  )
}
