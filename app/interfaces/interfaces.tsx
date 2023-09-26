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

export interface ClassLinkDetail {
  bot_id: string;
  bot_invite_link: string;
  bot_name: string;
  message: string;
}

export interface CardData {
  id: number;
  title: string;
  content: string;
}

export interface Semester {
  semesterID: string;
  description: string;
}

export interface Class {
  assistant: string;
  campus: string;
  class: string;
  day: number;
  id: string;
  room: string;
  totalStudent: number;
  shift: string;
  subject: string;
  courseOutlineId: string;
  realization: string;
}

export interface ClassLineGroup {
  class_id: string;
  class_line_group_id: string;
  last_linked_at: string;
}
