export type DesignStateType = {
  name: string; // Name of the layout design
  id: string; // Unique identifier for the layout design
  componentPath?: string;
  sections: Array<SectionType>;
  order: Array<string>; // Order of section IDs
};

export type SectionType = {
  id: string; // Unique identifier for the section
  componentPath: string;
  type?: string;
  content?: Record<string, string>[];
  breakpoints?: Record<string, number>[];
  layout?: {
    // Optional layout configuration for the section
    columns?: number; // Number of columns for multi-column layout
    rows?: number; // Optional: Number of rows within the section (default: auto)
    gap?: string; // Optional spacing between items within the section
  };
  order: number; // Useful for reordering sections within the same row/container (optional)
};

/*

Relationship Between Containers and Sections:
*********************************************
When rendering the layout, you'll iterate through the sections array. 
This array contains references to the IDs of sections you want to display within that specific container.

Benefits:
********
This approach organizes your layout visually by grouping sections into logical containers.
It allows for flexible configuration of content within each container using the layout object.
You can efficiently manage the order of sections by defining their order within the container's sections array.
*/
