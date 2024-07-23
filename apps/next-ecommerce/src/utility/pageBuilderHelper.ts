import { SectionType } from '@/DesignStateType';

/**
 * Checks if a section has a layout property.
 * @param section The section to check.
 * @returns True if the section has a layout property, false otherwise.
 */
export function hasLayout(
  section: SectionType,
): section is SectionType & { layout: { columns: number } } {
  return section?.layout?.columns !== undefined;
}

/**
 * Sorts sections based on the layout property.
 * @param sections The sections to sort.
 * @returns The sorted sections.
 */
export function sortSections(sections: SectionType[]): SectionType[] {
  return sections.sort((a, b) => {
    if (hasLayout(a) && hasLayout(b)) {
      // Both have layout, sort by columns (ascending)
      return a.layout.columns - b.layout.columns;
    } else if (hasLayout(a)) {
      // Section A has layout, section B doesn't, prioritize A
      return -1;
    } else if (hasLayout(b)) {
      // Section B has layout, section A doesn't, prioritize B
      return 1;
    } else {
      // Neither have layout, maintain original order (optional: sort by order property here)
      return a.order - b.order; // Optional: sort by order if needed for non-layout sections
    }
  });
}
