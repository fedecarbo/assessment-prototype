'use client'

import { useEffect, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useFutureAssessment } from './future-assessment-context'

export function SiteMapTask() {
  const { siteMapComments, updateSiteMapComments } = useFutureAssessment()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '140px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.max(140, scrollHeight) + 'px'
    }
  }, [siteMapComments])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSiteMapComments(e.target.value)
  }

  return (
    <>
      {/* Site map placeholder - Full width (1100px) */}
      <div className="mb-6">
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Site map
        </h3>
        <div className="border border-border bg-muted flex items-center justify-center w-full" style={{ height: '450px' }}>
          <p className="text-base text-muted-foreground">Site map placeholder - Red line boundary</p>
        </div>
      </div>

      {/* Comments section - Constrained width (723px) */}
      <div style={{ maxWidth: '723px' }}>
        <h3 className="mb-2 text-base font-semibold text-foreground">
          Comments
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          Add any comments about the site map boundary if corrections are needed
        </p>
        <Textarea
          ref={textareaRef}
          value={siteMapComments}
          onChange={handleTextChange}
          className="text-base leading-relaxed resize-none overflow-hidden"
          style={{ minHeight: '140px' }}
          placeholder="Enter comments..."
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Character count: {siteMapComments.length}
        </p>
      </div>
    </>
  )
}
