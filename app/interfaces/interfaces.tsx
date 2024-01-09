import { User } from "next-auth";

export interface ClassLineGroup {
  id: string;
  class_line_group_id: string;
  last_linked_at: string;
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

export interface ClassTransaction {
  className: string;
  classTransactionId: string;
  lecturerCode: string;
  lecturerName: string;
}

export interface Item {
  label: string;
  value: string;
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

export interface Channel {
  channel_id: string;
  channel_name: string;
  channel_description: string;
  channel_subscribers: string[];
}

export interface RoomClass {
  id: String;
  class: String;
  subject: String;
}

export interface MessageTemplate {
  id: string;
  owner_id: string;
  name: string;
  raw_content: string;
  is_shared: boolean,
  data_map: Map<string, any>;
  category: string;
}

export interface ScheduledMessage {
  id: string;
  recipients_string: string;
  content: string;
  time: string;
  scheduler_user_id: string;
}

export interface CourseOutline {
  id: string;
  name: string;
  subjects: string;
}
