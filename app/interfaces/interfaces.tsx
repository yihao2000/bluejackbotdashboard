export interface Class {
  classid: string;
  classname: string;
  courseid: string;

  is_active: number;
  is_global: number;
  is_nar_enabled: number;
}

export interface ClassLineGroup {
  id: string;
  class_line_group_id: string;
  last_linked_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credit: number;
}

export interface ClassDetail {
  id: string;
  classname: string;
  coursename: string;
  course_id: string;
  coursecode: string;
  is_active: number;
  is_global: number;
  is_nar_enabled: number;
  class_id: string;
  class_line_group_id: string;
  last_linked_at: Date;
  code: string;
  credit: number;
}

export interface CardData {
  id: number;
  title: string;
  content: string;
}
