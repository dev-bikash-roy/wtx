# Implementation Plan: Homepage SEO Structure Update

## Overview

This implementation plan restructures the WTX News homepage to improve SEO through proper semantic HTML heading hierarchy (H1, H2, H3). The update maintains existing visual design and functionality while adding clear content sections for UK regions (England, Scotland, Wales, Ireland), topic areas (Sports, Fashion, Travel), and a Latest News feed. All tasks use TypeScript and Next.js 14+ with React Server Components.

## Tasks

- [x] 1. Update homepage H1 and Top Stories section with proper heading structure
  - Verify H1 "UK Local News & Headlines" is present with sr-only class
  - Add H2 "Top Stories (UK)" with sr-only class before SectionLargeSlider
  - Update SectionLargeSlider to include H3 elements for lead and supporting story cards
  - Ensure aria-labelledby references the H2 heading ID
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 9.3_

- [x] 1.1 Write unit tests for Top Stories heading structure
  - Test H1 presence and text content
  - Test H2 "Top Stories (UK)" presence
  - Test H3 elements within story cards
  - _Requirements: 1.1, 1.2, 2.3, 2.4_

- [ ] 2. Implement England region section with Featured and Trending subsections
  - [x] 2.1 Add H2 "England" with sr-only class before England content section
    - Wrap England content in semantic section element
    - Add aria-labelledby attribute referencing H2 ID
    - _Requirements: 1.3, 3.1, 9.1, 9.2_
  
  - [-] 2.2 Update or create England section component with H3 subsections
    - Add H3 "Featured in England" for featured posts
    - Add H3 "Trending in England" for trending posts
    - Fetch posts from "england-news" category
    - Add CTA link "More England News" linking to "/england-news"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 2.3 Write unit tests for England section structure
    - Test H2 "England" presence
    - Test H3 "Featured in England" and "Trending in England" presence
    - Test CTA link presence and href
    - _Requirements: 1.3, 3.1, 3.2, 3.5_

- [ ] 3. Create placeholder sections for Scotland, Wales, and Ireland
  - [ ] 3.1 Add H2 "Scotland" with placeholder content
    - Add H3 "Featured in Scotland"
    - Add CTA link to "/scotland-news"
    - Wrap in semantic section element with aria-labelledby
    - _Requirements: 1.4, 4.1, 4.2, 9.1, 9.2_
  
  - [ ] 3.2 Add H2 "Wales" with placeholder content
    - Add H3 "Featured in Wales"
    - Add CTA link to "/wales-news"
    - Wrap in semantic section element with aria-labelledby
    - _Requirements: 1.5, 4.3, 4.4, 9.1, 9.2_
  
  - [ ] 3.3 Add H2 "Ireland" with placeholder content
    - Add H3 "Featured in Ireland"
    - Add CTA link to "/ireland-news"
    - Wrap in semantic section element with aria-labelledby
    - _Requirements: 1.6, 4.5, 4.6, 9.1, 9.2_
  
  - [ ] 3.4 Write unit tests for placeholder region sections
    - Test H2 presence for Scotland, Wales, Ireland
    - Test H3 presence for each region
    - Test CTA links for each region
    - _Requirements: 1.4, 1.5, 1.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Update Sports News section with proper heading structure
  - [ ] 5.1 Add H2 "Sports News" with sr-only class before sports content
    - Wrap sports content in semantic section element
    - Add aria-labelledby attribute
    - _Requirements: 1.7, 9.1, 9.2_
  
  - [ ] 5.2 Update sports section component with H3 subsections
    - Add H3 "Football" for football posts
    - Support additional H3 elements for other sports categories when available
    - Fetch posts from "sport" category
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 5.3 Write unit tests for Sports News section
    - Test H2 "Sports News" presence
    - Test H3 "Football" presence
    - Test posts are fetched from "sport" category
    - _Requirements: 1.7, 5.1, 5.4_

- [ ] 6. Implement Fashion section with proper heading structure
  - [ ] 6.1 Add H2 "Fashion" with sr-only class before fashion content
    - Wrap fashion content in semantic section element
    - Add aria-labelledby attribute
    - _Requirements: 1.8, 9.1, 9.2_
  
  - [ ] 6.2 Update or create fashion section component
    - Add H3 "Latest Fashion" for fashion posts
    - Fetch posts from "fashion" category or tag
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 6.3 Write unit tests for Fashion section
    - Test H2 "Fashion" presence
    - Test H3 "Latest Fashion" presence
    - Test posts are fetched from fashion category/tag
    - _Requirements: 1.8, 6.1, 6.3_

- [ ] 7. Implement Travel section with proper heading structure
  - [ ] 7.1 Add H2 "Travel Around the UK" with sr-only class before travel content
    - Wrap travel content in semantic section element
    - Add aria-labelledby attribute
    - _Requirements: 1.9, 9.1, 9.2_
  
  - [ ] 7.2 Update or create travel section component with H3 subsections
    - Add H3 "UK Destinations" for destination posts
    - Add H3 "Travel Tips" for travel tips posts
    - Fetch posts from "travel" category with UK-related tags
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 7.3 Write unit tests for Travel section
    - Test H2 "Travel Around the UK" presence
    - Test H3 "UK Destinations" and "Travel Tips" presence
    - Test posts are fetched from travel category
    - _Requirements: 1.9, 7.1, 7.2, 7.4_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement Latest News chronological feed
  - [ ] 9.1 Add H2 "Latest News" with sr-only class before latest news feed
    - Wrap latest news feed in semantic section element
    - Add aria-labelledby attribute
    - _Requirements: 1.10, 9.1, 9.2_
  
  - [ ] 9.2 Create or update Latest News feed component
    - Add H3 "Most recent" for the feed
    - Fetch posts without category or tag filters
    - Display posts in reverse chronological order (newest first)
    - Implement pagination support for browsing older content
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 9.3 Write unit tests for Latest News feed
    - Test H2 "Latest News" presence
    - Test H3 "Most recent" presence
    - Test posts are in reverse chronological order
    - Test pagination functionality
    - _Requirements: 1.10, 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Update navigation to reflect homepage structure
  - Add links to "/england-news", "/scotland-news", "/wales-news", "/ireland-news"
  - Add links to "/sports", "/fashion", "/travel"
  - Add link to "/latest" for Latest News feed
  - Ensure navigation labels match H2 section names
  - Update navigation data file (src/data/navigation.ts)
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 10.1 Write unit tests for navigation updates
  - Test all region links are present
  - Test all topic links are present
  - Test Latest News link is present
  - Test navigation labels match H2 headings
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 11. Update section components for semantic HTML and accessibility
  - [ ] 11.1 Update SectionLargeSlider component
    - Ensure H3 elements are used for story card titles
    - Add proper ARIA attributes
    - Maintain existing visual styling
    - _Requirements: 2.3, 2.4, 9.1, 9.4_
  
  - [ ] 11.2 Update SectionMagazine2 component (regions)
    - Add support for H3 subsection headings
    - Ensure proper semantic HTML structure
    - Add ARIA attributes for accessibility
    - _Requirements: 3.1, 3.2, 9.1, 9.2, 9.4_
  
  - [ ] 11.3 Update SectionSliderPosts component (sports)
    - Add support for H3 subsection headings
    - Ensure proper semantic HTML structure
    - Add ARIA attributes for accessibility
    - _Requirements: 5.1, 5.2, 9.1, 9.2, 9.4_
  
  - [ ] 11.4 Update or create components for Fashion and Travel sections
    - Add support for H3 subsection headings
    - Ensure proper semantic HTML structure
    - Add ARIA attributes for accessibility
    - _Requirements: 6.1, 7.1, 7.2, 9.1, 9.2, 9.4_
  
  - [ ] 11.5 Write unit tests for component updates
    - Test H3 elements are properly rendered
    - Test ARIA attributes are present
    - Test semantic HTML structure
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement controlled tags support
  - Update data fetching functions to support controlled tags
  - Add controlled tags to CMS configuration or constants file
  - Define tags: Politics, Crime, Transport, Health, Education, Weather, Economy, Housing, Courts, Environment
  - Ensure homepage sections can filter by controlled tags
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 13.1 Write unit tests for controlled tags
  - Test controlled tags are defined correctly
  - Test filtering by controlled tags works
  - Test posts are properly tagged
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 14. Update metadata and structured data
  - [ ] 14.1 Verify meta title is "UK Local News & Headlines | WTX News"
    - Update if necessary in page.tsx metadata export
    - _Requirements: 13.1_
  
  - [ ] 14.2 Update meta description to mention regions and topics
    - Include UK regions, breaking news, sports, fashion, and travel
    - _Requirements: 13.2_
  
  - [ ] 14.3 Verify Open Graph metadata for social sharing
    - Ensure proper title, description, and image
    - _Requirements: 13.3_
  
  - [ ] 14.4 Verify JSON-LD structured data
    - Ensure WebPage and NewsMediaOrganization schema types
    - _Requirements: 13.4_
  
  - [ ] 14.5 Verify canonical URL
    - Ensure canonical URL points to "https://wtxnews.co.uk"
    - _Requirements: 13.5_

- [ ] 14.6 Write unit tests for metadata
  - Test meta title is correct
  - Test meta description includes required keywords
  - Test Open Graph metadata is present
  - Test JSON-LD structured data is valid
  - Test canonical URL is correct
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 15. Optimize performance for mobile and desktop
  - Verify ISR revalidation period is 300 seconds
  - Ensure dynamic imports for below-the-fold components
  - Verify mobile detection reduces posts per section
  - Test that existing performance optimizations are maintained
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 15.1 Write performance tests
  - Test ISR revalidation is configured correctly
  - Test dynamic imports are working
  - Test mobile detection reduces data fetching
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 16. Final integration and validation
  - [ ] 16.1 Verify complete heading hierarchy on homepage
    - Test exactly one H1 element
    - Test all required H2 elements are present
    - Test H3 elements are properly nested under H2 elements
    - Test no heading levels are skipped
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 9.4_
  
  - [ ] 16.2 Verify all sections are properly wired together
    - Test data fetching for all sections
    - Test all CTA links work correctly
    - Test navigation links work correctly
    - _Requirements: 2.5, 3.6, 5.4, 6.3, 7.4, 8.5, 10.1, 10.2, 10.3_
  
  - [ ] 16.3 Run accessibility validation
    - Test with screen reader (manual or automated)
    - Verify ARIA attributes are correct
    - Verify semantic HTML structure
    - Test keyboard navigation
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 16.4 Write end-to-end integration tests
    - Test complete homepage rendering
    - Test all sections display correctly
    - Test navigation between sections
    - Test mobile vs desktop rendering
    - _Requirements: All requirements_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All components use TypeScript with Next.js 14+ React Server Components
- Maintain existing visual design while updating semantic HTML structure
- Use sr-only class for SEO headings that should be hidden visually
- All sections should use semantic HTML5 section elements with aria-labelledby
- Existing performance optimizations (ISR, dynamic imports, mobile detection) must be preserved
